import PropTypes from 'prop-types';
import React from 'react';
import ROSLIB from 'roslib';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import moment from 'moment';

import MUIDataTable from 'mui-datatables';
import { Box, IconButton, Tooltip, Typography, Modal, Backdrop, CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';
import { Fragment } from 'react';
import * as XLSX from 'xlsx';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function MachineDataTable({ id, stage, dataType, machineName, beginDate, endDate }) {
  const { translate } = useLocales();
  const [openLogs, setOpenLogs] = React.useState(false);
  const [isLoad, setIsLoad] = React.useState(false);
  const [logs, setLogs] = React.useState({
    // date: ['08/04/2024'],
    // shift: 'CN',
    // logs: [
    //   {
    //     time: '08:00:00',
    //     description: 'turn off',
    //   },
    // ],
  });
  const [data, setData] = React.useState([
    // {
    //   id: 1,
    //   date: '',
    //   shift: 'CN',
    //   noLoad: 15,
    //   underLoad: 15,
    //   offTime: 15,
    //   action: false,
    // },
  ]);
  const ros = React.useContext(RosPropsContext);

  const fetchData = (client, request, processData) => {
    client.callService(request, (result) => {
      if (result.success) {
        processData(result);
      }
    });
  };

  const processMachineData = (result) => {
    let dataShow = [];
    let k = 1;
    const machineData = result.machine_data.machine_data;
    for (let i = machineData.length - 1; i >= 0; i--) {
      dataShow.push([
        k,
        machineData[i].date,
        machineData[i].shift,
        machineData[i].noload,
        machineData[i].underload,
        machineData[i].offtime,
      ]);
      k++;
    }
    setData(dataShow);
  };

  const processStageData = (result) => {
    let dataShow = [];
    let k = 1;
    const stageData = result.stage_data[result.stage_data.length - 1].machine_data;
    for (let i = stageData.length - 1; i >= 0; i--) {
      dataShow.push([
        k,
        stageData[i].date,
        stageData[i].shift,
        stageData[i].noload,
        stageData[i].underload,
        stageData[i].offtime,
      ]);
      k++;
    }
    setData(dataShow);
  };

  // const handleDownloadStageCSV = async () => {
  //   setIsLoad(true);
  //   const zip = new JSZip();
  //   const folder = zip.folder(dataType === 'machine' ? `Stage ${stage} CSV Files` : `All Stage CSV Files`);

  //   // Lấy dữ liệu từ server
  //   const getStageDataClient = new ROSLIB.Service({
  //     ros: ros,
  //     name: dataType === 'machine' ? '/get_stage_data' : '/get_all_stage_data',
  //     serviceType: dataType === 'machine' ? 'vdm_machine_msgs/GetStageData' : 'vdm_machine_msgs/GetAllStageData',
  //   });

  //   const msgRequest =
  //     dataType === 'machine'
  //       ? {
  //           stage: stage,
  //           min_date: moment(beginDate).format('DD/MM/YYYY'),
  //           max_date: moment(endDate).format('DD/MM/YYYY'),
  //           shift: '',
  //         }
  //       : {
  //           min_date: moment(beginDate).format('DD/MM/YYYY'),
  //           max_date: moment(endDate).format('DD/MM/YYYY'),
  //           shift: '',
  //         };
  //   const requestStageData = new ROSLIB.ServiceRequest(msgRequest);

  //   if (stage !== 'no info') {
  //     getStageDataClient.callService(requestStageData, async function (result) {
  //       if (result.success) {
  //         const fields = [
  //           'ID',
  //           `${translate('Dates')}`,
  //           `${translate('Shifts')}`,
  //           `${translate('No-load operating time (min)')}`,
  //           `${translate('Underload operating time (min)')}`,
  //           `${translate('Shutdown time (min)')}`,
  //         ];

  //         const resultData = dataType === 'machine' ? result.stage_data : result.all_stage_data;
  //         let promises = resultData.map(async (machine) => {
  //           let machineData = [];
  //           const count = machine.machine_data.length - 1;
  //           let k = 1;
  //           for (let i = count; i >= 0; i--) {
  //             machineData.push([
  //               k,
  //               machine.machine_data[i].date,
  //               machine.machine_data[i].shift,
  //               machine.machine_data[i].noload,
  //               machine.machine_data[i].underload,
  //               machine.machine_data[i].offtime,
  //             ]);
  //           }
  //           // console.log('Machine name: ', machine.machine_name);
  //           // console.log(machineData);

  //           // chuyển đổi ngược data thành CSV vào lưu tạm vào folder
  //           const csvContent = Papa.unparse({ fields, data: machineData });
  //           folder.file(`${machine.machine_name}.csv`, csvContent);
  //         });

  //         // Chờ tất cả các tệp CSV được thêm vào thư mục
  //         await Promise.all(promises);

  //         // Tạo file zip và tải xuống
  //         zip.generateAsync({ type: 'blob' }).then((content) => {
  //           saveAs(content, dataType === 'machine' ? `stage_${stage}.zip` : 'all_stages_data.zip');
  //         });
  //         setIsLoad(false);
  //       }
  //     });
  //   }
  // };

  const handleDownloadStageExcel = async () => {
    setIsLoad(true);
    const workbook = XLSX.utils.book_new();

    // Lấy dữ liệu từ server
    const getStageDataClient = new ROSLIB.Service({
      ros: ros,
      name: dataType === 'machine' ? '/get_stage_data' : '/get_all_stage_data',
      serviceType: dataType === 'machine' ? 'vdm_machine_msgs/GetStageData' : 'vdm_machine_msgs/GetAllStageData',
    });

    const msgRequest =
      dataType === 'machine'
        ? {
            stage: stage,
            min_date: moment(beginDate).format('DD/MM/YYYY'),
            max_date: moment(endDate).format('DD/MM/YYYY'),
            shift: '',
          }
        : {
            min_date: moment(beginDate).format('DD/MM/YYYY'),
            max_date: moment(endDate).format('DD/MM/YYYY'),
            shift: '',
          };
    const requestStageData = new ROSLIB.ServiceRequest(msgRequest);

    if (stage !== '') {
      getStageDataClient.callService(requestStageData, async function (result) {
        if (result.success) {
          const fields = [
            'ID',
            `${translate('Dates')}`,
            `${translate('Shifts')}`,
            `${translate('No-load operating time (min)')}`,
            `${translate('Underload operating time (min)')}`,
            `${translate('Shutdown time (min)')}`,
          ];

          const resultData = dataType === 'machine' ? result.stage_data : result.all_stage_data;
          let promises = resultData.map(async (machine) => {
            let machineData = [];
            machine.machine_data.forEach((data, index) => {
              machineData.push([index + 1, data.date, data.shift, data.noload, data.underload, data.offtime]);
            });

            // Chuyển đổi dữ liệu thành sheet Excel
            const worksheet = XLSX.utils.aoa_to_sheet([fields, ...machineData]);
            XLSX.utils.book_append_sheet(workbook, worksheet, machine.machine_name);
          });

          // Chờ tất cả các sheet được thêm vào workbook
          await Promise.all(promises);

          // Tạo file Excel và tải xuống
          XLSX.writeFile(workbook, dataType === 'machine' ? `stage_${stage}.xlsx` : 'all_stages_data.xlsx');
          setIsLoad(false);
        }
      });
    }
  };

  const handleDownloadLogs = () => {
    setIsLoad(true);
    // Lấy dữ liệu từ server
    const getLogsDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_logs_data',
      serviceType: 'vdm_machine_msgs/GetMachineLogs',
    });

    const requestLogsData = new ROSLIB.ServiceRequest({
      id_machine: id,
      min_date: moment(beginDate).format('DD/MM/YYYY'),
      max_date: moment(endDate).format('DD/MM/YYYY'),
      shift: '',
    });

    getLogsDataClient.callService(requestLogsData, function (result) {
      if (result.success) {
        const fields = ['ID', `${translate('Dates')}`, `${translate('Times')}`, `${translate('States')}`];
        let dataLogs = [];
        let i = 1;
        result.machine_logs.forEach((machineLog) => {
          machineLog.logs.forEach((log) => {
            dataLogs.push([i, machineLog.date, log.time, log.description]);
            i++;
          });
        });
        downloadCSV(fields, dataLogs, `${machineName}-logs.csv`);
      }
      setIsLoad(false);
    });
  };

  const handleViewLogs = (date, shift) => {
    setIsLoad(true);
    setOpenLogs(true);
    // Lấy dữ liệu từ server
    var getLogsDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_logs_data',
      serviceType: 'vdm_machine_msgs/GetMachineLogs',
    });

    let requestLogsData = new ROSLIB.ServiceRequest({
      id_machine: id,
      min_date: date,
      max_date: date,
      shift,
    });

    getLogsDataClient.callService(requestLogsData, function (result) {
      if (result.success) {
        let logsArr = {
          date,
          shift,
          logs: [],
        };

        result.machine_logs.forEach((machineLog) => {
          if (machineLog.logs) {
            logsArr.logs.push(
              ...machineLog.logs.map((log) => ({
                time: `${machineLog.date} ${log.time}`,
                description: log.description,
              })),
            );
          } else {
            logsArr.logs = [];
          }
        });
        setLogs(logsArr);
        setIsLoad(false);
      }
    });
  };

  function downloadCSV(fields, data, filename) {
    // Tạo nội dung của tệp CSV từ dữ liệu
    var csv = Papa.unparse({ fields, data });

    // Tạo một đối tượng blob từ nội dung CSV
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });

    // Tạo một URL cho blob
    var url = window.URL.createObjectURL(blob);

    // Tạo một thẻ a để tải xuống
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Thêm thẻ a vào DOM và kích hoạt sự kiện click
    document.body.appendChild(a);
    a.click();

    // Xóa thẻ a sau khi tải xuống
    document.body.removeChild(a);

    // Giải phóng URL
    window.URL.revokeObjectURL(url);
  }

  React.useEffect(() => {
    if (dataType === 'machine') {
      const getMachineDataClient = new ROSLIB.Service({
        ros: ros,
        name: '/get_machine_data',
        serviceType: 'vdm_machine_msgs/GetMachineData',
      });
      const requestMachineData = new ROSLIB.ServiceRequest({
        id_machine: id,
        min_date: moment(beginDate).format('DD/MM/YYYY'),
        max_date: moment(endDate).format('DD/MM/YYYY'),
        shift: '',
      });
      if (id !== 0) {
        fetchData(getMachineDataClient, requestMachineData, processMachineData);
      }
    } else {
      const getStageDataClient = new ROSLIB.Service({
        ros: ros,
        name: '/get_stage_data',
        serviceType: 'vdm_machine_msgs/GetStageData',
      });
      const requestStageData = new ROSLIB.ServiceRequest({
        stage: stage,
        min_date: moment(beginDate).format('DD/MM/YYYY'),
        max_date: moment(endDate).format('DD/MM/YYYY'),
        shift: '',
      });
      if (stage !== '') {
        fetchData(getStageDataClient, requestStageData, processStageData);
      }
    }
  }, [id, stage, dataType, beginDate, endDate]);

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
      label: `${translate('Dates')}`,
      options: {
        filter: true,
        sort: true,
        // sortThirdClickReset: true,
      },
    },
    {
      name: 'shift',
      label: `${translate('Shifts')}`,
      options: {
        filter: true,
        sort: true,
        // sortThirdClickReset: true,
      },
    },
    {
      name: 'noLoad',
      label: `${translate('No-load operating time (min)')}`,
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'underLoad',
      label: `${translate('Underload operating time (min)')}`,
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'offTime',
      label: `${translate('Shutdown time (min)')}`,
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  if (dataType === 'machine') {
    columns.push({
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
              <Tooltip title={translate('View logs')} arrow>
                <IconButton
                  aria-label="view"
                  date={tableMeta.rowData[1]}
                  shift={tableMeta.rowData[2]}
                  // color="primary"
                  sx={{ fontSize: '1.1rem', '&:hover': { color: '#1890ff' } }}
                  onClick={(event) => {
                    handleViewLogs(event.currentTarget.getAttribute('date'), event.currentTarget.getAttribute('shift'));
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    });
  }

  const options = {
    filter: true,
    // rowsPerPage: 30,
    // rowsPerPageOptions: [10, 30, 50, 100],
    filterType: 'dropdown',
    responsive: 'standard',
    fixedHeader: true,
    tableBodyHeight: '860px',
    selectableRows: 'none',
    downloadOptions: {
      filename: dataType === 'machine' ? `datamachine-${machineName}.csv` : `datastage-${stage}.csv`,
    },
  };
  return (
    <Box>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={
            dataType === 'machine'
              ? `${translate('Machine data table')} ${machineName}`
              : `${translate('Bảng dữ liệu công đoạn')} ${stage}`
          }
          data={data}
          columns={columns}
          options={{
            ...options,
            customToolbar: () => (
              <Fragment>
                <LoadingButton
                  // disabled={isLoad}
                  loading={isLoad}
                  loadingPosition="start"
                  startIcon={<DownloadIcon />}
                  variant="contained"
                  onClick={handleDownloadStageExcel}
                  sx={{ marginLeft: '20px' }}
                >
                  {dataType === 'machine'
                    ? `${translate('Download Stage')}: ${stage}`
                    : translate('Download All Stages')}
                </LoadingButton>
                {dataType === 'machine' ? (
                  <LoadingButton
                    // disabled={isLoad}
                    loading={isLoad}
                    loadingPosition="start"
                    startIcon={<DownloadIcon />}
                    variant="contained"
                    onClick={handleDownloadLogs}
                    sx={{ marginLeft: '20px' }}
                  >
                    {translate('Download LOGS')}
                  </LoadingButton>
                ) : null}
              </Fragment>
            ),
          }}
        />
      </ThemeProvider>
      {!isLoad ? (
        <Modal
          open={openLogs}
          onClose={() => setOpenLogs(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              {`${translate('Operation logs ')}(${logs.date}-${logs.shift})`}
            </Typography>

            <div style={{ maxHeight: 400, overflow: 'auto' }}>
              {logs.logs?.map((log, index) => (
                <Typography id="modal-modal-description" sx={{ mt: 2 }} key={index}>
                  {`${log.time}: ${log.description}`}
                </Typography>
              ))}
            </div>
          </Box>
        </Modal>
      ) : null}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoad}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

MachineDataTable.propTypes = {
  id: PropTypes.number,
  stage: PropTypes.string,
  dataType: PropTypes.string,
  machineName: PropTypes.string,
  beginDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
};

export default MachineDataTable;
