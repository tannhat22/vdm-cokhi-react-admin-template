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
    // [0, 1, 'Machine 1', 70, 239, 239, 100, 3, false],
    // [1, 2, 'Machine 2', 60, 191, 191, 120, 1, false],
    // [2, 3, 'Machine 3', 70, 211, 211, 115, 1, false],
  ]);
  const ros = React.useContext(RosPropsContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dashboardUrl = menuItems.items[0].children[3].url;
  const dashboardId = menuItems.items[0].children[3].id;

  const targetStatic = {
    LA: 25,
    MA: 30,
    BJ: 30,
    GC: 30,
    GS: 40,
    GR: 40,
    EN: 50,
    GJ: 50,
    EW: 70,
    GP: 70,
    MC: 70,
    LN: 70,
  };

  React.useEffect(() => {
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: '/state_machines',
      messageType: 'vdm_machine_msgs/MachinesStateStamped',
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
          targetStatic[data.state_machines[i].type] ? targetStatic[data.state_machines[i].type] : 0,
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
      name: 'target',
      label: translate('Mục tiêu hoạt động có tải (%)'),
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        setCellProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        customBodyRender: (value) => {
          return `${value}%`;
        },
      },
    },
    {
      name: 'noLoad',
      label: translate('Tỉ lệ hoạt động không tải (%)'),
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        setCellProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        customBodyRender: (value) => {
          const rateOperate = (value * 100) / 720;
          return `${rateOperate.toFixed(2)}%  `;
        },
      },
    },
    {
      name: 'underLoad',
      label: translate('Tỉ lệ hoạt động có tải (%)'),
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        setCellProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        customBodyRender: (value) => {
          const rateOperate = (value * 100) / 720;
          return `${rateOperate.toFixed(2)}%  `;
        },
      },
    },
    {
      name: 'offTime',
      label: translate('Tỉ lệ tắt máy (%)'),
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        setCellProps: () => ({
          style: { textAlign: 'center', justifyContent: 'center' },
        }),
        customBodyRender: (value) => {
          const rateOperate = (value * 100) / 720;
          return `${rateOperate.toFixed(2)}%  `;
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
        setCellProps: () => ({
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
      filename: 'tilehoatdong.csv',
    },
  };

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable title={translate('Bảng Tỉ Lệ Hoạt Động Máy')} data={data} columns={columns} options={options} />
    </ThemeProvider>
  );
}

export default OverviewTable;
