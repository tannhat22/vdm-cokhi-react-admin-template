import PropTypes from 'prop-types';
import { useState, useContext, useEffect, useMemo } from 'react';
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
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project import
import InformArea from './InformArea';
import OperationTimeChart from './OperationTimeChart';
import MainCard from 'components/MainCard';
import MachineDataTable from './MachineDataTable';
import SignalLightArea from './SignalLightArea';
import ResetForm from './ResetForm';
import { MaterialUISwitch } from 'components/CustomizedSwitches';

import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
const DashboardDefault = () => {
  const location = useLocation();
  const { translate } = useLocales();

  let id = 0;
  let stt = 0;
  if (location.state) {
    id = location.state.id;
    stt = location.state.stt;
    // console.log(`id: ${id}`);
    // console.log(`stt: ${stt}`);
  }

  const today = useMemo(() => new Date(), []);
  const threeMonthsAgo = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  }, []);
  const specifiedMinDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 12);
    return date;
  }, []);

  const [daysInput, setDaysInput] = useState(10);
  const [daysChart, setDaysChart] = useState(daysInput);
  const [idMachine, setIdMachine] = useState(id);
  const [sttMachine, setSttMachine] = useState(stt);
  const [machineNames, setMachineNames] = useState([]);
  const [shiftChart, setShiftChart] = useState('CN');
  const [selectedBeginDate, setSelectedBeginDate] = useState(threeMonthsAgo);
  const [selectedEndDate, setSelectedEndDate] = useState(today);
  const [dataType, setDataType] = useState('machine'); // Thêm state mới

  const ros = useContext(RosPropsContext);

  useEffect(() => {
    var getMachinesNameClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_all_machine_name',
      serviceType: 'vdm_machine_msgs/GetAllMachineName',
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
            type: result.machines_type[i],
            plc: result.plc_model[i],
            address: result.plc_address[i],
          });
        }
        setMachineNames(dataNames);
      }
      // console.log(result.success);
      // console.log('da phan hoi');
    });
  }, []);

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

  const handleShiftChange = (event) => {
    event.target.checked ? setShiftChart('CD') : setShiftChart('CN');
  };

  const handleDaysChange = (event) => {
    let value = parseInt(event.target.value, 10);
    if (value > 30) {
      value = 30;
    } else if (value < 1) {
      value = 1;
    }

    setDaysInput(value);
  };

  const handleDataTypeChange = () => {
    setDataType((prevType) => (prevType === 'machine' ? 'stage' : 'machine'));
  };

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
          renderInput={(params) => <TextField {...params} label={translate('Select machine name')} />}
        />
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        <Button size="large" variant="contained" sx={{ width: '100%', height: '100%' }} onClick={handleDataTypeChange}>
          {dataType === 'machine' ? 'Chuyển sang dữ liệu công đoạn' : 'Chuyển sang dữ liệu máy'}
        </Button>
      </Grid>
      <Grid item xs={12} md={3} lg={3}>
        {idMachine !== 0 && machineNames.length > 0 ? (
          <ResetForm
            id={idMachine}
            machineName={machineNames[sttMachine].label}
            plcModel={machineNames[sttMachine].plc}
            plcAddress={machineNames[sttMachine].address}
          />
        ) : null}
        {/* <ResetForm id={1} machineName="machine1" plcModel="kv7500" plcAddress={1} /> */}
      </Grid>
      <InformArea
        id={idMachine}
        stage={idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].type : ''}
        dataType={dataType}
      />
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 2 */}
      <Grid item xs={12} md={dataType === 'machine' ? 8 : 12} lg={dataType === 'machine' ? 9 : 12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">
              {dataType === 'machine'
                ? translate(
                    `Biểu đồ  thời gian hoạt động của máy ${
                      idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].label : ''
                    }`,
                  )
                : translate(
                    `Biểu đồ  thời gian hoạt động của công đoạn ${
                      idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].type : ''
                    }`,
                  )}
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={2}>
              <TextField
                id="outlined-daysNum"
                label={translate('Choose days')}
                type="number"
                InputLabelProps={{
                  shrink: true,
                  max: 30,
                  min: 1,
                }}
                value={daysInput}
                onChange={handleDaysChange}
              />
              <Button
                size="large"
                variant="outlined"
                onClick={() => {
                  setDaysChart(daysInput);
                }}
                disabled={isNaN(daysInput) || daysChart === daysInput}
              >{`${daysInput} ngày gần nhất`}</Button>

              <FormGroup>
                <FormControlLabel
                  control={<MaterialUISwitch defaultChecked={false} onChange={handleShiftChange} shift={shiftChart} />}
                />
              </FormGroup>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <OperationTimeChart
              id={idMachine}
              stage={idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].type : ''}
              dataType={dataType}
              shift={shiftChart}
              daysNum={daysChart}
              maxDate={today}
            />
          </Box>
        </MainCard>
      </Grid>
      {dataType === 'machine' ? (
        <Grid item xs={12} md={4} lg={3}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">{translate('Signal light')}</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button size="large">
                  {idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].label : 'no info'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <MainCard sx={{ mt: 1.5 }} content={false}>
            <SignalLightArea id={idMachine} />
          </MainCard>
        </Grid>
      ) : null}

      {/* row 3 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">
              {dataType === 'machine' ? translate('Machine data') : translate('Dữ liệu công đoạn')}
            </Typography>
          </Grid>
          <Grid item display="flex">
            <Box sx={{ marginRight: '16px' }}>
              <DatePicker
                label={translate('Begin date')}
                value={selectedBeginDate}
                onChange={(date) => {
                  setSelectedBeginDate(date);
                }}
                minDate={specifiedMinDate}
                maxDate={today}
              />
            </Box>
            <DatePicker
              label={translate('End date')}
              value={selectedEndDate}
              onChange={(date) => {
                setSelectedEndDate(date);
              }}
              minDate={specifiedMinDate}
              maxDate={today}
            />
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <MachineDataTable
            id={idMachine}
            stage={idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].type : ''}
            dataType={dataType}
            machineName={idMachine !== 0 && machineNames.length > 0 ? machineNames[sttMachine].label : 'no info'}
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
