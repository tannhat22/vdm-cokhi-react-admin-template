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
    height: 350,
    stacked: true,
    stackType: '100%',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  // legend: {
  //   show: false, // 👈 Tắt chú thích cột màu
  // },
};

// ==============================|| INCOME AREA CHART ||============================== //

const ColumnChart = ({ stage, shift }) => {
  const theme = useTheme();
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  let dataShow = { dates: [], offtimes: [], noloads: [], underloads: [] };
  stage.data.forEach((stData) => {
    if (stData.shift === shift) {
      dataShow.dates.push(stData.date.slice(0, 5));
      dataShow.offtimes.push(stData.offtime);
      dataShow.noloads.push(stData.noload);
      dataShow.underloads.push(stData.underload);
    }
  });

  const days = dataShow.dates;
  const series = [
    { name: 'Có tải', data: dataShow.underloads },
    { name: 'Không tải', data: dataShow.noloads },
    { name: 'Tắt máy', data: dataShow.offtimes },
  ];

  const chartOption = {
    ...areaChartOptions,
    title: {
      text: `Biểu đồ lịch sử của công đoạn ${stage.stageName}`,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
      },
    },
    colors: ['rgb(0, 227, 150)', 'rgba(252,185,0,1)', 'rgb(199, 199, 200)'],
    annotations: {
      yaxis: [
        {
          y: stage.target,
          borderColor: 'rgb(255, 0, 0)',
          label: {
            borderColor: 'rgb(255, 0, 0)',
            style: {
              color: '#fff',
              background: 'rgb(255, 0, 0)',
            },
            text: `Mục tiêu ${stage.target}%`,
          },
        },
      ],
    },
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
  };

  return <ReactApexChart options={chartOption} series={series} type="bar" height={350} />;
};

ColumnChart.propTypes = {
  stage: PropTypes.object,
  shift: PropTypes.string,
};

export default ColumnChart;
