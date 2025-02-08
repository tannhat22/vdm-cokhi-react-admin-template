import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    type: 'bar',
    height: 450,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
};

// ==============================|| INCOME AREA CHART ||============================== //

const ColumnChart = ({ categories, series, colors }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      // colors: [theme.palette.primary.main, 'rgb(0, 227, 150)', 'rgba(252,185,0,1)'],
      // colors: ['rgb(199, 199, 200)', 'rgba(252,185,0,1)', 'rgb(0, 227, 150)'],
      fill: {
        colors: colors,
      },
      xaxis: {
        categories: categories,
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
  }, [primary, secondary, line, theme, categories, colors]);

  return <ReactApexChart options={options} series={series} type="bar" height={450} />;
};

ColumnChart.propTypes = {
  categories: PropTypes.array,
  series: PropTypes.array,
  colors: PropTypes.array,
};

export default ColumnChart;
