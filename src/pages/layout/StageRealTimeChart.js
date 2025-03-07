import { useState, useEffect, useContext } from 'react';
import ROSLIB from 'roslib';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import RosPropsContext from 'context/RosPropsContext';

// Hàm để lấy giá trị mục tiêu từ biến môi trường dựa trên tên công đoạn
const getTargetValue = (stage) => {
  return Number(process.env[`REACT_APP_TARGET_${stage}`]);
};

const minutesInShift = Number(process.env.REACT_APP_MINUTES_IN_SHIFT);
const stagesOrdinal = process.env.REACT_APP_STAGES_ORDINAL;

// chart options
const areaChartOptions = {
  title: {
    text: 'Biểu đồ phân tích toàn bộ công đoạn theo thời gian thực',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
    },
  },
  chart: {
    type: 'line', // Sử dụng 'line' để tạo biểu đồ kết hợp
    height: 350,
    stacked: true,
    stackOnlyBar: true,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [3],
  },
  stroke: {
    width: [0, 0, 0, 2], // Đặt độ rộng của đường cho chuỗi dữ liệu đường
    // curve: 'smooth',
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    },
  },
  markers: {
    size: 0,
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
  },
  grid: {
    borderColor: '#f1f1f1',
  },
  colors: ['rgb(0, 227, 150)', 'rgba(252,185,0,1)', 'rgb(199, 199, 200)', 'rgb(255, 0, 0)'],
};

// ==============================|| INCOME AREA CHART ||============================== //

const StageRealTimeChart = () => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [stages, setStages] = useState(['LA', 'MA', 'BJ', 'GC', 'GS', 'GR', 'EN', 'GJ', 'EW', 'GP', 'MC', 'LN', 'ED']);
  const [series, setSeries] = useState([
    {
      name: 'Có tải',
      type: 'column',
      data: [10, 40, 50, 60, 35, 54, 75, 70, 40, 50, 70, 40, 50],
    },
    {
      name: 'Không tải',
      type: 'column',
      data: [40, 50, 20, 20, 35, 26, 10, 15, 40, 30, 15, 40, 30],
    },
    {
      name: 'Tắt máy',
      type: 'column',
      data: [30, 10, 30, 20, 30, 20, 15, 15, 20, 20, 15, 20, 20],
    },
    {
      name: 'Mục tiêu',
      type: 'line',
      data: stages.map((stage) => getTargetValue(stage)), // Dữ liệu mục tiêu
    },
  ]);

  const ros = useContext(RosPropsContext);

  useEffect(() => {
    const listener = new ROSLIB.Topic({
      ros: ros,
      name: '/state_machines',
      messageType: 'vdm_machine_msgs/MachinesStateStamped',
    });

    const subscription_callback = function (message) {
      processStageData(message);
    };

    listener.subscribe(subscription_callback);

    const processStageData = (realTimeData) => {
      realTimeData.overral_machines.sort((a, b) => stagesOrdinal.indexOf(a.type) - stagesOrdinal.indexOf(b.type));

      let dataShow = { stages: [], offtimes: [], noloads: [], underloads: [], targets: [] };
      realTimeData.overral_machines.forEach((stage) => {
        const sumMinute = minutesInShift * stage.quantity;
        dataShow.stages.push(stage.type);
        dataShow.offtimes.push(Math.round((stage.offtime * 100) / sumMinute));
        dataShow.noloads.push(Math.round((stage.noload * 100) / sumMinute));
        dataShow.underloads.push(Math.round((stage.underload * 100) / sumMinute));
      });
      updateChart(dataShow);
    };

    const updateChart = (dataShow) => {
      // if (JSON.stringify(stages) !== JSON.stringify(dataShow.stages)) {
      //   setStages(dataShow.stages);
      // }
      setStages((prevStages) => {
        if (JSON.stringify(prevStages) !== JSON.stringify(dataShow.stages)) {
          return dataShow.stages;
        }
        return prevStages; // Giữ nguyên nếu không đổi
      });

      setSeries([
        { name: 'Có tải', type: 'column', data: dataShow.underloads },
        { name: 'Không tải', type: 'column', data: dataShow.noloads },
        { name: 'Tắt máy', type: 'column', data: dataShow.offtimes },
        { name: 'Mục tiêu', type: 'line', data: dataShow.stages.map((stage) => getTargetValue(stage)) },
      ]);
    };

    return () => {
      listener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        categories: stages,
        labels: {
          style: {
            colors: ['black'],
          },
        },
        axisBorder: {
          show: true,
          color: line,
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Phần trăm (%)',
        },
        labels: {
          style: {
            colors: [secondary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
      tooltip: {
        theme: 'light',
      },
    }));
  }, [primary, secondary, line, theme, stages]);

  return <ReactApexChart options={options} series={series} type="line" height={350} />;
};

export default StageRealTimeChart;
