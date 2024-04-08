import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ROSLIB from 'roslib';

import { IconButton, Tooltip } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
// import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import SignalLight from 'components/SignalLight';
import RosPropsContext from 'context/RosPropsContext';
import { activeItem } from 'store/reducers/menu';
import menuItems from 'menu-items';
import { useLocales } from 'locales';

function OverviewTable() {
  const { translate } = useLocales();
  const [data, setData] = React.useState([
    // [0, 1, 'Machine 1', 239, 239, 1, false],
    // [1, 2, 'Machine 2', 191, 191, 1, false],
    // [2, 3, 'Machine 3', 211, 211, 1, false],
  ]);
  const ros = React.useContext(RosPropsContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dashboardUrl = menuItems.items[0].children[2].url;
  const dashboardId = menuItems.items[0].children[2].id;

  React.useEffect(() => {
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: '/state_machines',
      messageType: 'vdm_cokhi_machine_msgs/MachinesStateStamped',
    });

    let subscription_callback = function (message) {
      handleDataWebsocket(message);
    };

    listener.subscribe(subscription_callback);

    function handleDataWebsocket(data) {
      let dataShow = [];
      for (let i = 0; i < data.machines_quantity; i++) {
        dataShow.push([
          i,
          data.id_machines[i],
          data.state_machines[i].name,
          data.state_machines[i].noload,
          data.state_machines[i].underload,
          data.state_machines[i].offtime,
          data.state_machines[i].signal_light,
          false,
        ]);
      }
      setData(dataShow);
    }

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const redirectToDashboard = (id, stt) => {
    // console.log(id);
    dispatch(activeItem({ openItem: [dashboardId] }));
    navigate(dashboardUrl, {
      state: {
        id,
        stt,
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
      name: 'stt',
      label: ' ',
      options: {
        filter: false,
        sort: false,
      },
    },
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
      label: translate('Machine name'),
      options: {
        filter: true,
        sort: true,
        sortThirdClickReset: true,
      },
    },
    {
      name: 'noLoad',
      label: translate('No-load operating time'),
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          let hours = Math.floor(value / 60);
          let mins = value % 60;
          if (hours < 10) hours = `0${hours}`;
          if (mins < 10) mins = `0${mins}`;
          return `${hours} h : ${mins} m  `;
        },
      },
    },
    {
      name: 'underLoad',
      label: translate('Underload operating time'),
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          let hours = Math.floor(value / 60);
          let mins = value % 60;
          if (hours < 10) hours = `0${hours}`;
          if (mins < 10) mins = `0${mins}`;
          return `${hours} h : ${mins} m  `;
        },
      },
    },
    {
      name: 'offTime',
      label: translate('Shutdown time'),
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          let hours = Math.floor(value / 60);
          let mins = value % 60;
          if (hours < 10) hours = `0${hours}`;
          if (mins < 10) mins = `0${mins}`;
          return `${hours} h : ${mins} m  `;
        },
      },
    },
    {
      name: 'signalLight',
      label: translate('Signal light'),
      options: {
        filter: false,
        sort: false,
        download: false,
        setCellHeaderProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
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
              <Tooltip title="View" arrow>
                <IconButton
                  aria-label="view"
                  machineid={tableMeta.rowData[1]}
                  stt={tableMeta.rowData[0]}
                  // color="primary"
                  sx={{ fontSize: '1.1rem', '&:hover': { color: '#1890ff' } }}
                  onClick={(event) => {
                    redirectToDashboard(
                      Number(event.currentTarget.getAttribute('machineid')),
                      Number(event.currentTarget.getAttribute('stt')),
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    // rowsPerPage: 10,
    // rowsPerPageOptions: [10, 20, 100],
    filterType: 'dropdown',
    responsive: 'standard',
    fixedHeader: true,
    tableBodyHeight: '760px',
    selectableRows: 'none',
    downloadOptions: {
      filename: 'datamachine.csv',
    },
  };

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable title={translate('Overall Machine Status Table')} data={data} columns={columns} options={options} />
    </ThemeProvider>
  );
}

export default OverviewTable;
