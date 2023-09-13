import React from 'react';
// import { useState, useEffect, useContext } from 'react';
import { useContext } from 'react';

// import FormControlLabel from '@mui/material/FormControlLabel';
// import TextField from '@mui/material/TextField';
// import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import SignalLight from 'components/SignalLight/SignalLight';
import RosPropsContext from 'context/RosPropsContext';

function OverviewTable() {
  // const [data, setData] = useState([]);
  const data = [];
  const ros = useContext(RosPropsContext);

  ros.on('error', function (error) {
    console.log(error);
  });
  // console.log(ros.ros);

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              // backgroundColor: '#FF0000',
            },
          },
        },
      },
    });

  const columns = [
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'name',
      label: 'Machine name',
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
      },
    },
    {
      name: 'noLoadTime',
      label: 'No-load operating time',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'loadTime',
      label: 'Under load operating time',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'signalLight',
      label: 'Signal Light',
      options: {
        filter: false,
        sort: false,
        download: false,
        customBodyRender: (value) =>
          value === 1 ? (
            <SignalLight color="green" />
          ) : value === 2 ? (
            <SignalLight color="yellow" />
          ) : value === 3 ? (
            <SignalLight color="red" />
          ) : (
            <p>No operation</p>
          ),
      },
    },
    {
      name: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        download: false,
        customBodyRender: () => {
          return <Button sx={{ textTransform: 'none' }}>View</Button>;
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    selectableRows: 'none',
    downloadOptions: {
      filename: 'datamachine.csv',
    },
  };

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable title={'Machine State Overview'} data={data} columns={columns} options={options} />
    </ThemeProvider>
  );
}

export default OverviewTable;
