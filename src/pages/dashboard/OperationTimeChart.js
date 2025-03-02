import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import ROSLIB from 'roslib';
import moment from 'moment';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import RosPropsContext from 'context/RosPropsContext';

// chart options
const areaChartOptions = {
  chart: {
    type: 'bar',
    height: 450,
    stacked: true,
    stackType: '100%',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  // stroke: {
  //   curve: 'smooth',
  //   width: 2,
  // },
  // grid: {
  //   strokeDashArray: 0,
  // },
};

// ==============================|| INCOME AREA CHART ||============================== //

const OperationTimeChart = ({ id, stage, dataType, shift, daysNum, maxDate }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [days, setDays] = useState([]); //'10/12','11/12','12/12','13/12','14/12','15/12','16/12','17/12','18/12','19/12','20/12'
  const [series, setSeries] = useState([
    {
      name: 'Có tải',
      data: [], //50, 40, 20, 10, 20, 30, 40, 15, 40, 90
    },
    {
      name: 'Không tải',
      data: [], //50, 40, 20, 10, 20, 30, 40, 15, 40, 90
    },
    {
      name: 'Tắt máy',
      data: [], //10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    },
  ]);

  const ros = useContext(RosPropsContext);

  const fetchData = (client, request, processData) => {
    client.callService(request, (result) => {
      if (result.success) {
        processData(result);
      }
    });
  };

  const processMachineData = (result) => {
    let dataShow = { dates: [], offtimes: [], noloads: [], underloads: [] };
    result.machine_data.machine_data.forEach((mcData) => {
      dataShow.dates.push(mcData.date.slice(0, 5));
      dataShow.offtimes.push(mcData.offtime);
      dataShow.noloads.push(mcData.noload);
      dataShow.underloads.push(mcData.underload);
    });
    updateChart(dataShow);
  };

  const processStageData = (result) => {
    let dataShow = { dates: [], offtimes: [], noloads: [], underloads: [] };
    const lastStageData = result.stage_data[result.stage_data.length - 1];
    lastStageData.machine_data.forEach((stData) => {
      dataShow.dates.push(stData.date.slice(0, 5));
      dataShow.offtimes.push(stData.offtime);
      dataShow.noloads.push(stData.noload);
      dataShow.underloads.push(stData.underload);
    });
    updateChart(dataShow);
  };

  const updateChart = (dataShow) => {
    setDays(dataShow.dates);
    setSeries([
      { name: 'Có tải', data: dataShow.underloads },
      { name: 'Không tải', data: dataShow.noloads },
      { name: 'Tắt máy', data: dataShow.offtimes },
    ]);
  };

  useEffect(() => {
    if (isNaN(daysNum)) return;
    const dateConf = new Date('2199-01-01');
    if (dateConf <= maxDate) return;

    let dayBack = new Date(maxDate.getTime() - (daysNum - 1) * 24 * 60 * 60 * 1000);
    const minDate = moment(dayBack).format('DD/MM/YYYY');
    const maxDateFormatted = moment(maxDate).format('DD/MM/YYYY');

    if (dataType === 'machine') {
      const getMachineDataClient = new ROSLIB.Service({
        ros: ros,
        name: '/get_machine_data',
        serviceType: 'vdm_machine_msgs/GetMachineData',
      });
      const requestMachineData = new ROSLIB.ServiceRequest({
        id_machine: id,
        min_date: minDate,
        max_date: maxDateFormatted,
        shift,
      });
      if (id !== 0) {
        fetchData(getMachineDataClient, requestMachineData, processMachineData);
      }
    } else {
      const getStageDataClient = new ROSLIB.Service({
        ros: ros,
        name: '/get_stage_data',
        serviceType: 'vdm_machine_msgs/GetStageData',
      });
      const requestStageData = new ROSLIB.ServiceRequest({
        stage: stage,
        min_date: minDate,
        max_date: maxDateFormatted,
        shift,
      });
      if (stage !== '') {
        fetchData(getStageDataClient, requestStageData, processStageData);
      }
    }
  }, [id, stage, dataType, shift, daysNum, maxDate]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: ['rgb(0, 227, 150)', 'rgba(252,185,0,1)', 'rgb(199, 199, 200)'],
      xaxis: {
        categories: days,
        labels: {
          style: {
            colors: ['black'],
          },
        },
        axisBorder: {
          show: true,
          color: line,
        },
        tickAmount: 7,
      },
      yaxis: {
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
  }, [primary, secondary, line, theme, days]);

  return <ReactApexChart options={options} series={series} type="bar" height={450} />;
};

OperationTimeChart.propTypes = {
  id: PropTypes.number,
  stage: PropTypes.string,
  dataType: PropTypes.string,
  shift: PropTypes.string,
  daysNum: PropTypes.number,
  maxDate: PropTypes.instanceOf(Date).isRequired,
};

export default OperationTimeChart;
