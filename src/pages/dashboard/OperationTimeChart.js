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

const OperationTimeChart = ({ id }) => {
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
    var getMachineDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_machine_data',
      serviceType: 'vdm_cokhi_machine_msgs/GetMachineData',
    });

    let requestMachineData = new ROSLIB.ServiceRequest({
      id_machine: id,
      days: 10,
    });

    getMachineDataClient.callService(requestMachineData, function (result) {
      if (result.success) {
        let dates = [];
        for (let i = 0; i < result.dates.length; i++) {
          dates.push(result.dates[i].slice(result.dates[i].indexOf('-') + 1, result.dates[i].indexOf(' ')));
        }
        setDays(dates);
        setSeries([
          {
            name: 'Tắt máy',
            data: result.offtime,
          },
          {
            name: 'Không tải',
            data: result.noload,
          },
          {
            name: 'Có tải',
            data: result.underload,
          },
        ]);
      }
    });
  }, [id]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, 'rgb(0, 227, 150)', 'rgba(252,185,0,1)'],
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
};

export default OperationTimeChart;
