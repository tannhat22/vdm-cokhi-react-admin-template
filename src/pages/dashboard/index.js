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
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';

// project import
import InformArea from './InformArea';
import OperationTimeChart from './OperationTimeChart';
import MainCard from 'components/MainCard';
import MachineDataTable from './MachineDataTable';
import SignalLightArea from './SignalLightArea';
import Login from './PassWordForm';

import RosPropsContext from 'context/RosPropsContext';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
const DashboardDefault = () => {
  const location = useLocation();
  let id = 1;
  if (location.state) {
    id = location.state.id;
  }

  const [days, setDays] = useState(30);
  const [idMachine, setIdMachine] = useState(id);
  const [machineNames, setMachineNames] = useState([]);

  const ros = useContext(RosPropsContext);

  useEffect(() => {
    // var resetMachineClient = new ROSLIB.Service({
    //   ros: ros,
    //   name: '/reset_machine',
    //   serviceType: 'vdm_cokhi_machine_msgs/ResetMachine',
    // });

    var getMachinesNameClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_all_machine_name',
      serviceType: 'vdm_cokhi_machine_msgs/GetAllMachineName',
    });

    let requestMachinesName = new ROSLIB.ServiceRequest({
      get_allname: true,
    });

    getMachinesNameClient.callService(requestMachinesName, function (result) {
      let dataNames = [];
      for (let i = 0; i < result.machines_quantity; i++) {
        dataNames.push({
          id: i + 1,
          label: result.machines_name[i],
        });
      }
      setMachineNames(dataNames);
    });
  }, []);

  function handleValueChange(event, value, reason) {
    if (reason === 'selectOption') {
      const idMachineNew = machineNames.findIndex((machineName) => {
        return value.label === machineName.label;
      });
      if (idMachineNew !== -1) {
        setIdMachine(idMachineNew + 1);
      } else {
        console.log('Machine name not found');
      }
    }
  }

  function handleChangeSelectDays(event) {
    setDays(event.target.value);
  }

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
          value={machineNames.length ? machineNames[idMachine - 1].label : null}
          sx={{ width: '100%' }}
          onChange={handleValueChange}
          renderInput={(params) => <TextField {...params} label="Machine name" />}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        {machineNames.length ? <Login id={idMachine} machineName={machineNames[idMachine - 1].label} /> : null}
      </Grid>
      <InformArea />
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={8} lg={9}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Operating time statistics</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                // onClick={() => setSlot('7 days')}
                // color={slot === '7 days' ? 'primary' : 'secondary'}
                // variant={slot === '7 days' ? 'outlined' : 'text'}
              >
                7 days ago
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <OperationTimeChart />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Signal Light</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button size="small">{machineNames.length ? machineNames[idMachine - 1].label : 'no info'}</Button>
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
            <Typography variant="h5">Machine data</Typography>
          </Grid>
          <Grid item>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="days-select-label">Days</InputLabel>
                <Select
                  labelId="days-select-label"
                  id="days-simple-select"
                  value={days}
                  label="Days"
                  onChange={handleChangeSelectDays}
                >
                  <MenuItem value={7}>7 days</MenuItem>
                  <MenuItem value={14}>14 days</MenuItem>
                  <MenuItem value={30}>30 days</MenuItem>
                  <MenuItem value={90}>All data</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <MachineDataTable
            id={idMachine}
            machineName={machineNames.length ? machineNames[idMachine - 1].label : 'no info'}
            days={days}
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
