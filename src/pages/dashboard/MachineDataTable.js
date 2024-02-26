import PropTypes from 'prop-types';
import React from 'react';
import ROSLIB from 'roslib';

// import Button from '@mui/material/Button';
import MUIDataTable from 'mui-datatables';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';

function MachineDataTable({ id, machineName, beginDate, endDate }) {
  const { translate } = useLocales();
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
  // console.log(endDate);

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
          const count = result.dates.length - 1;
          let k = 1;
          for (let i = count; i >= 0; i--) {
            const date = new Date(result.dates[i]);
            if (date <= endDate && date >= beginDate) {
              dataShow.push([k, result.dates[i], result.noload[i], result.underload[i], result.offtime[i]]);
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
          options={options}
        />
      </ThemeProvider>
    </Box>
  );
}

MachineDataTable.propTypes = {
  id: PropTypes.number,
  // days: PropTypes.number,
  machineName: PropTypes.string,
  beginDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
};

export default MachineDataTable;
