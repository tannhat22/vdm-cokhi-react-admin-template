import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 350,
    type: 'area',
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 2, 2],
    curve: 'straight',
  },
  markers: {
    size: 0,
  },
  legend: {
    show: true,
  },
};

// ==============================|| INCOME AREA CHART ||============================== //

const LineChart = ({ stageName, stageData }) => {
  const theme = useTheme();
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const series = [
    { name: 'Có tải', data: stageData.underloads },
    { name: 'Không tải', data: stageData.noloads },
    { name: 'Tắt máy', data: stageData.offtimes },
  ];

  const chartOption = {
    ...areaChartOptions,
    title: {
      text: `Biểu đồ  công đoạn ${stageName} theo thời gian thực`,
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
          y: stageData.target,
          borderColor: 'rgb(255, 0, 0)',
          label: {
            borderColor: 'rgb(255, 0, 0)',
            style: {
              color: '#fff',
              background: 'rgb(255, 0, 0)',
            },
            text: `Mục tiêu ${stageData.target}%`,
          },
        },
      ],
    },
    xaxis: {
      categories: stageData.times,
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
  };

  return <ReactApexChart options={chartOption} series={series} type="area" height={350} />;
};

LineChart.propTypes = {
  stageName: PropTypes.string.isRequired,
  stageData: PropTypes.object,
};

export default LineChart;
