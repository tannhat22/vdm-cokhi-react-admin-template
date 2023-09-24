// import PropTypes from 'prop-types';
import React from 'react';
import ROSLIB from 'roslib';

// import { IconButton, Tooltip } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import RosPropsContext from 'context/RosPropsContext';
import AddMachineForm from './AddMachineForm';
import EditMachineForm from './EditMachineForm';
import DeleteMachineForm from './DeleteMachineForm';

function SettingPage() {
  const [data, setData] = React.useState([
    {
      id: 1,
      name: 'Machine 1',
      action: false,
    },
    {
      id: 2,
      name: 'Machine 2',
      action: false,
    },
  ]);

  // console.log('re-render');

  const ros = React.useContext(RosPropsContext);

  React.useEffect(() => {
    // Get All machine name service
    var getAllMachineNameClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_all_machine_name',
      serviceType: 'vdm_cokhi_machine_msgs/GetAllMachineName',
    });

    let requestAllMachineName = new ROSLIB.ServiceRequest({
      get_allname: true,
    });

    getAllMachineNameClient.callService(requestAllMachineName, function (result) {
      let dataShow = [];
      for (let i = 0; i < result.machines_quantity; i++) {
        dataShow.push([i + 1, result.machines_name[i], false]);
      }
      setData(dataShow);
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
      name: 'name',
      label: 'Machine name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        download: false,
        setCellHeaderProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        setCellProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        customBodyRender: (value, tableMeta) => {
          return (
            <div>
              <EditMachineForm id={tableMeta.rowData[0]} machineName={tableMeta.rowData[1]} />
              <DeleteMachineForm id={tableMeta.rowData[0]} machineName={tableMeta.rowData[1]} />
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    selectableRows: 'none',
    download: false,
    print: false,
  };

  return (
    <Box>
      <ThemeProvider theme={getMuiTheme()}>
        <AddMachineForm />
        <br />
        <MUIDataTable title={`Machines table`} data={data} columns={columns} options={options} />
      </ThemeProvider>
    </Box>
  );
}

export default SettingPage;
