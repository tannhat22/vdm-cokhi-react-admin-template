import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ROSLIB from 'roslib';

import Button from '@mui/material/Button';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import SignalLight from 'components/SignalLight';
import RosPropsContext from 'context/RosPropsContext';
import { activeItem } from 'store/reducers/menu';
import menuItems from 'menu-items';

function OverviewTable() {
  const [data, setData] = React.useState([]);
  const ros = React.useContext(RosPropsContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dashboardUrl = menuItems.items[0].children[1].url;
  const dashboardId = menuItems.items[0].children[1].id;

  React.useEffect(() => {
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: '/state_machines',
      messageType: 'vdm_cokhi_machine_msgs/StateMachinesStamped',
    });

    let subscription_callback = function (message) {
      handleDataWebsocket(message);
    };

    listener.subscribe(subscription_callback);

    function handleDataWebsocket(data) {
      let dataShow = [];
      for (let i = 0; i < data.state_machines.number_machine; i++) {
        dataShow.push([
          i + 1,
          data.state_machines.machines_name[i],
          data.state_machines.noload_time[i],
          data.state_machines.underload_time[i],
          data.state_machines.signal_light[i],
          false,
        ]);
      }
      setData(dataShow);
    }

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const redirectToDashboard = (id) => {
    dispatch(activeItem({ openItem: [dashboardId] }));
    navigate(dashboardUrl, {
      state: {
        id,
      },
    });
  };

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
        customBodyRender: (value, tableMeta) => {
          // console.log(tableMeta.rowData[1]);
          return (
            <Button
              machineid={tableMeta.rowData[0]}
              sx={{ textTransform: 'none' }}
              onClick={(event) => {
                redirectToDashboard(Number(event.target.getAttribute('machineid')));
              }}
            >
              View
            </Button>
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
