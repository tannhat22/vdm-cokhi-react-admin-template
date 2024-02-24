import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ROSLIB from 'roslib';

// material-ui
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  // InputLabel,
  // MenuItem,
  // FormControl,
  // Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project import
import InformArea from './InformArea';
import OperationTimeChart from './OperationTimeChart';
import MainCard from 'components/MainCard';
import MachineDataTable from './MachineDataTable';
import SignalLightArea from './SignalLightArea';
import ResetForm from './ResetForm';

import RosPropsContext from 'context/RosPropsContext';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
const DashboardDefault = () => {
  const location = useLocation();
  let id = 0;
  let stt = 0;
  if (location.state) {
    id = location.state.id;
    stt = location.state.stt;
    // console.log(`id: ${id}`);
    // console.log(`stt: ${stt}`);
  }

  // const [days, setDays] = useState(365);
  const [idMachine, setIdMachine] = useState(id);
  const [sttMachine, setSttMachine] = useState(stt);
  const [machineNames, setMachineNames] = useState([]);
  const [selectedBeginDate, setSelectedBeginDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [specifiedMinDate, setSpecifiedMinDate] = useState(new Date('2023-9-01'));
  const [specifiedMaxDate, setSpecifiedMaxDate] = useState(new Date('2024-02-24'));
  const ros = useContext(RosPropsContext);

  useEffect(() => {
    var getMachinesNameClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_all_machine_name',
      serviceType: 'vdm_cokhi_machine_msgs/GetAllMachineName',
    });

    let requestMachinesName = new ROSLIB.ServiceRequest({
      get_allname: true,
    });

    getMachinesNameClient.callService(requestMachinesName, function (result) {
      if (result.success) {
        let dataNames = [];
        for (let i = 0; i < result.machines_quantity; i++) {
          dataNames.push({
            id: result.id_machines[i],
            label: result.machines_name[i],
          });
        }
        setMachineNames(dataNames);
      }
    });
  }, []);

  useEffect(() => {
    var getMachineDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_machine_data',
      serviceType: 'vdm_cokhi_machine_msgs/GetMachineData',
    });

    let requestMachineData = new ROSLIB.ServiceRequest({
      id_machine: idMachine,
      days: 365,
    });

    getMachineDataClient.callService(requestMachineData, function (result) {
      if (result.success) {
        // let dataMachine = [];
        const datesLength = result.dates.length;
        // for (let i = 0; i < datesLength; i++) {
        //   let j = days - (i + 1);
        //   dataMachine.push([i + 1, result.dates[j], result.noload[j], result.underload[j], result.offtime[j]]);
        // }
        setSelectedBeginDate(result.dates[0]);
        setSelectedEndDate(result.dates[datesLength - 1]);
        setSpecifiedMinDate(result.dates[0]);
        setSpecifiedMaxDate(result.dates[datesLength - 1]);
        // setDataMachine(dataMachine);
      }
    });
  }, [idMachine]);

  function handleValueChange(event, value, reason) {
    if (reason === 'selectOption') {
      const sttMachineNew = machineNames.findIndex((machineName) => {
        return value.label === machineName.label;
      });

      if (sttMachineNew !== -1) {
        setSttMachine(sttMachineNew);
        setIdMachine(machineNames[sttMachineNew].id);
      } else {
        console.log('Machine name not found');
      }
    }
  }

  // function handleChangeSelectDays(event) {
  //   setDays(event.target.value);
  // }

  // function handleDateChange(date) {
  //   console.log(date);
  // }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      {/* <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5" sx={{ paddingBottom: '14px' }}>
          Dashboard
        </Typography>
      </Grid> */}
      <Grid item xs={12} md={6} lg={6}>
        <Autocomplete
          disablePortal
          id="combo-box-machine"
          options={machineNames}
          isOptionEqualToValue={(option, value) => {
            return option.label === value;
          }}
          value={idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].label : null}
          sx={{ width: '100%' }}
          onChange={handleValueChange}
          renderInput={(params) => <TextField {...params} label="Chọn tên máy" />}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        {idMachine !== 0 && machineNames.length > 0 ? (
          <ResetForm id={idMachine} machineName={machineNames[sttMachine].label} />
        ) : null}
      </Grid>
      <InformArea id={idMachine} />
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={8} lg={9}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Biểu đồ thời giạn hoạt động</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button size="small">10 ngày gần nhất</Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <OperationTimeChart id={idMachine} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Đèn tín hiệu</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button size="small">
                {idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].label : 'no info'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1.5 }} content={false}>
          <SignalLightArea id={idMachine} />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Dữ liệu của máy</Typography>
          </Grid>
          <Grid item display="flex">
            <Box sx={{ marginRight: '16px' }}>
              <DatePicker
                label="Từ ngày"
                value={selectedBeginDate}
                onChange={(date) => {
                  setSelectedBeginDate(date);
                }}
                minDate={specifiedMinDate}
                maxDate={specifiedMaxDate}
              />
            </Box>
            <DatePicker
              label="Đến ngày"
              value={selectedEndDate}
              onChange={(date) => {
                setSelectedEndDate(date);
              }}
              minDate={specifiedMinDate}
              maxDate={specifiedMaxDate}
            />
            {/* <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="days-select-label">Ngày</InputLabel>
                <Select
                  labelId="days-select-label"
                  id="days-simple-select"
                  value={days}
                  label="Days"
                  onChange={handleChangeSelectDays}
                >
                  <MenuItem value={7}>7 ngày</MenuItem>
                  <MenuItem value={14}>14 ngày</MenuItem>
                  <MenuItem value={30}>30 ngày</MenuItem>
                  <MenuItem value={90}>90 ngày</MenuItem>
                  <MenuItem value={365}>Tất cả dữ liệu</MenuItem>
                </Select>
              </FormControl>
            </Box> */}
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <MachineDataTable
            id={idMachine}
            machineName={idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].label : 'no info'}
            // days={days}
            beginDate={selectedBeginDate}
            endDate={selectedEndDate}
          />
        </MainCard>
      </Grid>
    </Grid>
  );
};

DashboardDefault.propTypes = {
  id: PropTypes.number,
};

export default DashboardDefault;
