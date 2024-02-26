// import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ROSLIB from 'roslib';

// import { IconButton, Tooltip } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import RosPropsContext from 'context/RosPropsContext';
import AddMachineForm from './AddMachineForm';
import EditMachineForm from './EditMachineForm';
import DeleteMachineForm from './DeleteMachineForm';
import { useLocales } from 'locales';

function SettingPage() {
  const { translate } = useLocales();

  const [reRender, setReRender] = useState(false);
  const [data, setData] = React.useState([
    // {
    //   stt: 0,
    //   id: 1,
    //   name: 'Machine 1',
    //   type: 'GS',
    //   plc: 'KV-5500',
    //   address: 3,
    //   action: false,
    // },
    // {
    //   stt: 1,
    //   id: 2,
    //   name: 'Machine 2',
    //   type: 'GS',
    //   action: false,
    // },
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
        dataShow.push([
          i,
          result.id_machines[i],
          result.machines_name[i],
          result.machines_type[i],
          result.plc_model[i],
          result.plc_address[i],
          false,
        ]);
      }
      setData(dataShow);
    });
  }, [reRender]);

  function updateFromChild() {
    setReRender(!reRender);
  }

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
      name: 'stt',
      label: ' ',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'id',
      label: 'ID',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'name',
      label: translate('Machine name'),
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'type',
      label: translate('Machine type'),
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'plc',
      label: 'PLC Model',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'address',
      label: translate('PLC Address'),
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'action',
      label: translate('Action'),
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
              <EditMachineForm
                id={tableMeta.rowData[1]}
                machineName={tableMeta.rowData[2]}
                machineType={tableMeta.rowData[3]}
                plc={tableMeta.rowData[4]}
                address={tableMeta.rowData[5]}
                update={updateFromChild}
              />
              <DeleteMachineForm
                id={tableMeta.rowData[1]}
                machineName={tableMeta.rowData[2]}
                machineType={tableMeta.rowData[3]}
                update={updateFromChild}
              />
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
    fixedHeader: true,
    tableBodyHeight: '700px',
    selectableRows: 'none',
    download: false,
    print: false,
  };

  return (
    <Box>
      <ThemeProvider theme={getMuiTheme()}>
        <AddMachineForm update={updateFromChild} />
        <br />
        <MUIDataTable title={translate('Machine Setup Table')} data={data} columns={columns} options={options} />
      </ThemeProvider>
    </Box>
  );
}

export default SettingPage;
