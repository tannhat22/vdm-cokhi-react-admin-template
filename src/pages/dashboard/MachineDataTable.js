import PropTypes from 'prop-types';
import React from 'react';
import ROSLIB from 'roslib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

import MUIDataTable from 'mui-datatables';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';

import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';

function MachineDataTable({ id, machineName, machineType, beginDate, endDate }) {
  const { translate } = useLocales();
  const [isLoad, setIsLoad] = React.useState(false);
  const [data, setData] = React.useState([
    // {
    //   id: 1,
    //   date: '',
    //   noLoad: 15,
    //   underLoad: 15,
    //   offTime: 15,
    // },
  ]);
  const ros = React.useContext(RosPropsContext);
  // console.log(beginDate);

  const handleDownloadStageCSV = async () => {
    setIsLoad(true);
    const zip = new JSZip();
    const folder = zip.folder('Machine CSV Files');

    // Lấy dữ liệu từ server
    var getStageDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_stage_data',
      serviceType: 'vdm_cokhi_machine_msgs/GetStageData',
    });

    let requestStageData = new ROSLIB.ServiceRequest({
      stage: machineType,
      days: 365,
    });

    if (machineType !== 'no info') {
      getStageDataClient.callService(requestStageData, async function (result) {
        if (result.success) {
          let dataStage = result.machines_data;
          const fields = [
            'ID',
            `${translate('Dates')}`,
            `${translate('No-load operating time (min)')}`,
            `${translate('Underload operating time (min)')}`,
            `${translate('Shutdown time (min)')}`,
          ];

          let promises = dataStage.map(async (machine) => {
            const count = machine.dates.length - 1;
            let k = 1;
            let machineData = [];
            for (let i = count; i >= 0; i--) {
              const date = new Date(machine.dates[i]);
              if (date <= endDate && date >= beginDate) {
                machineData.push([k, machine.dates[i], machine.noload[i], machine.underload[i], machine.offtime[i]]);
                k++;
              }
            }
            // console.log('Machine name: ', machine.machine_name);
            // console.log(machineData);

            // chuyển đổi ngược data thành CSV vào lưu tạm vào folder
            const csvContent = Papa.unparse({ fields, data: machineData });
            folder.file(`${machine.machine_name}.csv`, csvContent);
          });

          // Chờ tất cả các tệp CSV được thêm vào thư mục
          await Promise.all(promises);

          // Tạo file zip và tải xuống
          zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'machines_data.zip');
          });
          setIsLoad(false);
        }
      });
    }
  };

  React.useEffect(() => {
    var getMachineDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_machine_data',
      serviceType: 'vdm_cokhi_machine_msgs/GetMachineData',
    });

    let requestMachineData = new ROSLIB.ServiceRequest({
      id_machine: id,
      days: 365,
    });

    if (id !== 0) {
      getMachineDataClient.callService(requestMachineData, function (result) {
        if (result.success) {
          let dataShow = [];
          const count = result.machine_data.dates.length - 1;
          let k = 1;
          for (let i = count; i >= 0; i--) {
            const date = new Date(result.machine_data.dates[i]);
            if (date <= endDate && date >= beginDate) {
              dataShow.push([
                k,
                result.machine_data.dates[i],
                result.machine_data.noload[i],
                result.machine_data.underload[i],
                result.machine_data.offtime[i],
              ]);
              k++;
            }
          }
          setData(dataShow);
        }
      });
    }
  }, [id, beginDate, endDate]);

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
      filename: `datamachine-${machineName}.csv`,
    },
  };

  return (
    <Box>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={`${translate('Machine data table')} (${machineName})`}
          data={data}
          columns={columns}
          options={{
            ...options,
            customToolbar: () => (
              <LoadingButton
                // disabled={isLoad}
                loading={isLoad}
                loadingPosition="start"
                startIcon={<DownloadIcon />}
                variant="contained"
                onClick={handleDownloadStageCSV}
                sx={{ marginLeft: '20px' }}
              >
                {translate('Download STAGE')}: {machineType}
              </LoadingButton>
            ),
          }}
        />
      </ThemeProvider>
    </Box>
  );
}

MachineDataTable.propTypes = {
  id: PropTypes.number,
  // days: PropTypes.number,
  machineName: PropTypes.string,
  machineType: PropTypes.string,
  beginDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
};

export default MachineDataTable;
