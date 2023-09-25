import PropTypes from 'prop-types';
import React from 'react';
import ROSLIB from 'roslib';

// import Button from '@mui/material/Button';
import MUIDataTable from 'mui-datatables';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import RosPropsContext from 'context/RosPropsContext';

function MachineDataTable({ id, days, machineName }) {
  // console.log(days);
  // const [days, setDays] = React.useState(30);
  const [data, setData] = React.useState([
    // {
    //   id: 1,
    //   date: '',
    //   noLoad: 15,
    //   underLoad: 15,
    // },
  ]);
  const ros = React.useContext(RosPropsContext);

  React.useEffect(() => {
    var getMachineDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_machine_data',
      serviceType: 'vdm_cokhi_machine_msgs/GetMachineData',
    });

    let requestMachineData = new ROSLIB.ServiceRequest({
      id_machine: id,
      days,
    });

    getMachineDataClient.callService(requestMachineData, function (result) {
      if (result.success) {
        let dataShow = [];
        for (let i = 0; i < days; i++) {
          dataShow.push([i + 1, result.dates[i], result.noload[i], result.underload[i]]);
        }
        setData(dataShow);
      }
    });
  }, []);

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
      name: 'date',
      label: 'Date',
      options: {
        filter: true,
        sort: true,
        // sortThirdClickReset: true,
      },
    },
    {
      name: 'noLoad',
      label: 'No-load operating time (minutes)',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'underLoad',
      label: 'Under load operating time (minutes)',
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    selectableRows: 'none',
    downloadOptions: {
      filename: `datamachine-${machineName}.csv`,
    },
  };

  return (
    <Box>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable title={`Machine data (${machineName})`} data={data} columns={columns} options={options} />
      </ThemeProvider>
    </Box>
  );
}

MachineDataTable.propTypes = {
  id: PropTypes.number,
  days: PropTypes.number,
  machineName: PropTypes.string,
};

export default MachineDataTable;