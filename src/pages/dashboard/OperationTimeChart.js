import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import ROSLIB from 'roslib';

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

const OperationTimeChart = ({ id, shift, daysNum }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [days, setDays] = useState([]); //'10/12','11/12','12/12','13/12','14/12','15/12','16/12','17/12','18/12','19/12','20/12'
  const [series, setSeries] = useState([
    {
      name: 'Tắt máy',
      data: [], //10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    },
    {
      name: 'Không tải',
      data: [], //50, 40, 20, 10, 20, 30, 40, 15, 40, 90
    },
    {
      name: 'Có tải',
      data: [], //50, 40, 20, 10, 20, 30, 40, 15, 40, 90
    },
  ]);

  const ros = useContext(RosPropsContext);

  useEffect(() => {
    if (isNaN(daysNum)) return;

    // console.log('SHIFT CHART: ', shift);
    // console.log('Days CHART: ', daysNum);

    var getMachineDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_machine_data',
      serviceType: 'vdm_cokhi_machine_msgs/GetMachineData',
    });

    let requestMachineData = new ROSLIB.ServiceRequest({
      id_machine: id,
      days: daysNum,
    });
    if (id !== 0) {
      getMachineDataClient.callService(requestMachineData, function (result) {
        if (result.success) {
          // let dates = [];
          let dataShow = {
            dates: [],
            offtimes: [],
            noloads: [],
            underloads: [],
          };
          for (let i = 0; i < result.machine_data.dates.length; i++) {
            if (shift === result.machine_data.shift[i]) {
              dataShow.dates.push(result.machine_data.dates[i].slice(0, 5));
              dataShow.offtimes.push(result.machine_data.offtime[i]);
              dataShow.noloads.push(result.machine_data.noload[i]);
              dataShow.underloads.push(result.machine_data.underload[i]);
            }
          }
          setDays(dataShow.dates);
          setSeries([
            {
              name: 'Tắt máy',
              // data: result.machine_data.offtime,
              data: dataShow.offtimes,
            },
            {
              name: 'Không tải',
              // data: result.machine_data.noload,
              data: dataShow.noloads,
            },
            {
              name: 'Có tải',
              // data: result.machine_data.underload,
              data: dataShow.underloads,
            },
          ]);
        }
      });
    }
  }, [id, shift, daysNum]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      // colors: [theme.palette.primary.main, 'rgb(0, 227, 150)', 'rgba(252,185,0,1)'],
      colors: ['rgb(199, 199, 200)', 'rgba(252,185,0,1)', 'rgb(0, 227, 150)'],
      xaxis: {
        categories: days,
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
            ],
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
  shift: PropTypes.string,
  daysNum: PropTypes.number,
};

export default OperationTimeChart;
