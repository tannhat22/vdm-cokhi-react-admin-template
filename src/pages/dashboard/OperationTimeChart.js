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
    height: 450,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  grid: {
    strokeDashArray: 0,
  },
};

// ==============================|| INCOME AREA CHART ||============================== //

const OperationTimeChart = ({ id }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [days, setDays] = useState([]);
  const [series, setSeries] = useState([
    {
      name: 'No-load',
      data: [],
    },
    {
      name: 'Under Load',
      data: [],
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
      days: 7,
    });

    getMachineDataClient.callService(requestMachineData, function (result) {
      if (result.success) {
        setDays(result.dates);
        setSeries([
          {
            name: 'No-load',
            data: result.noload,
          },
          {
            name: 'Under Load',
            data: result.underload,
          },
        ]);
      }
    });
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
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
  }, [primary, secondary, line, theme]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

OperationTimeChart.propTypes = {
  id: PropTypes.number,
};

export default OperationTimeChart;
