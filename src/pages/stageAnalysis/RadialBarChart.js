import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    type: 'radialBar',
    height: 450,
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

const RadialBarChart = ({ chartName, categories, series }) => {
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
      plotOptions: {
        radialBar: {
          hollow: {
            size: '40%', // Độ lớn phần rỗng bên trong
          },
          dataLabels: {
            total: {
              show: true,
              label: 'OEE',
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                const average = total / w.globals.seriesTotals.length;
                return `${Math.round(average)}%`; // Làm tròn total
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
  }, [primary, secondary, line, theme, chartName, categories]);

  return <ReactApexChart options={options} series={series} type="radialBar" height={378} />;
};

RadialBarChart.propTypes = {
  chartName: PropTypes.string,
  categories: PropTypes.array,
  series: PropTypes.array,
  colors: PropTypes.array,
};

export default RadialBarChart;
