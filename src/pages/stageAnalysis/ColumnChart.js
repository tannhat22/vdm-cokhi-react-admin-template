import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';

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
  legend: {
    show: false, // 👈 Tắt chú thích cột màu
  },
};

// ==============================|| INCOME AREA CHART ||============================== //

const ColumnChart = ({ chartName, target, categories, series, colors }) => {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;
  // const [options, setOptions] = useState(areaChartOptions);
  const chartOption = {
    ...areaChartOptions,
    title: {
      text: chartName,
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
      },
    },
    colors: colors,
    plotOptions: {
      bar: {
        distributed: true, // Cho phép từng cột có màu riêng
      },
    },
    annotations: {
      yaxis: [
        {
          y: target,
          borderColor: 'red',
          label: {
            borderColor: 'red',
            style: {
              color: '#fff',
              background: 'red',
            },
            text: '',
          },
        },
      ],
    },
    xaxis: {
      categories: categories,
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
      min: 0,
      max: 100,
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
  };
  // useEffect(() => {
  //   setOptions((prevState) => ({
  //     ...prevState,
  //     title: {
  //       text: chartName,
  //       align: 'center',
  //       style: {
  //         fontSize: '20px',
  //         fontWeight: 'bold',
  //         color: '#333',
  //       },
  //     },
  //     colors: colors,
  //     plotOptions: {
  //       bar: {
  //         distributed: true, // Cho phép từng cột có màu riêng
  //       },
  //     },
  //     annotations: {
  //       yaxis: [
  //         {
  //           y: target,
  //           borderColor: 'red',
  //           label: {
  //             borderColor: 'red',
  //             style: {
  //               color: '#fff',
  //               background: 'red',
  //             },
  //             text: '',
  //           },
  //         },
  //       ],
  //     },
  //     xaxis: {
  //       categories: categories,
  //       labels: {
  //         style: {
  //           colors: ['black'],
  //         },
  //       },
  //       axisBorder: {
  //         show: true,
  //         color: line,
  //       },
  //       tickAmount: 7,
  //     },
  //     yaxis: {
  //       min: 0,
  //       max: 100,
  //       labels: {
  //         style: {
  //           colors: [secondary],
  //         },
  //       },
  //     },
  //     grid: {
  //       borderColor: line,
  //     },
  //     tooltip: {
  //       theme: 'light',
  //     },
  //   }));
  // }, [primary, secondary, line, theme, chartName, target, categories, colors]);

  return <ReactApexChart options={chartOption} series={series} type="bar" height={366} />;
};

ColumnChart.propTypes = {
  chartName: PropTypes.string,
  target: PropTypes.number,
  categories: PropTypes.array,
  series: PropTypes.array,
  colors: PropTypes.array,
};

export default ColumnChart;
