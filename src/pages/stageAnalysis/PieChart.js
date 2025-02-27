import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    type: 'donut',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  legend: {
    show: true, // 👈 Tắt chú thích cột màu
  },
};

// ==============================|| INCOME AREA CHART ||============================== //

const PieChart = ({ chartName, categories, series, colors }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      title: {
        text: chartName,
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
        },
      },
      colors: colors,
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10,
          },
          donut: {
            size: '65%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: undefined,
                offsetY: -10,
                formatter: function (val) {
                  return val;
                },
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                color: undefined,
                offsetY: 16,
                formatter: function (val) {
                  return val;
                },
              },
              total: {
                show: true,
                showAlways: false,
                label: 'Tổng máy',
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                // formatter: function (w) {
                //   return w.globals.seriesTotals.reduce((a, b) => {
                //     return a + b;
                //   }, 0);
                // },
              },
            },
          },
        },
      },
      labels: categories,
      grid: {
        borderColor: line,
      },
      tooltip: {
        theme: 'light',
      },
    }));
  }, [primary, secondary, line, theme, chartName, categories, colors]);

  return <ReactApexChart options={options} series={series} type="donut" height={378} />;
};

PieChart.propTypes = {
  chartName: PropTypes.string,
  categories: PropTypes.array,
  series: PropTypes.array,
  colors: PropTypes.array,
};

export default PieChart;
