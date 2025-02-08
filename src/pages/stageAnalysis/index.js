// import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from 'react';
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

// project import
// import InformArea from './InformArea';
// import OperationTimeChart from './OperationTimeChart';
import MainCard from 'components/MainCard';
import { MaterialUISwitch } from 'components/CustomizedSwitches';

import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
const StageInformation = () => {
  const { translate } = useLocales();

  const [daysInput, setDaysInput] = useState(10);
  const [daysChart, setDaysChart] = useState(daysInput);
  const [stageSelected, setStageSelected] = useState('');
  const [stageMachines, setStageMachines] = useState({});
  // const [shiftChart, setShiftChart] = useState('CN');
  // const [selectedBeginDate, setSelectedBeginDate] = useState(new Date());
  // const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  // const [specifiedMinDate, setSpecifiedMinDate] = useState(new Date('2023-9-01'));
  // const [specifiedMaxDate, setSpecifiedMaxDate] = useState(new Date('2200-01-01'));
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
      let allStageMachine = {};
      if (result.success) {
        for (let i = 0; i < result.machines_quantity; i++) {
          allStageMachine = {
            ...allStageMachine,
            [result.machines_type[i]]: [...(allStageMachine[result.machines_type[i]] || []), result.machines_name[i]],
          };
        }
        setStageMachines(allStageMachine);
      }
      // console.log(result.success);
      // console.log('da phan hoi');
    });
  }, []);

  useEffect(() => {
    var getMinMaxDateClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_min_max_date',
      serviceType: 'vdm_machine_msgs/GetMinMaxDate',
    });
    // console.log(machineNames[sttMachine].type);
    let requestMinMaxDate = new ROSLIB.ServiceRequest({
      stage: stageSelected,
    });
    if (stageSelected !== '') {
      getMinMaxDateClient.callService(requestMinMaxDate, function (result) {
        if (result.success) {
          const minDateArr = result.min_date.split('/');
          const maxDateArr = result.max_date.split('/');
          setSpecifiedMinDate(new Date(Number(minDateArr[2]), Number(minDateArr[1]) - 1, Number(minDateArr[0])));
          setSpecifiedMaxDate(new Date(Number(maxDateArr[2]), Number(maxDateArr[1]) - 1, Number(maxDateArr[0])));
        }
      });
    }
  }, [stageSelected]);

  function handleValueChange(event, value, reason) {
    if (reason === 'selectOption') {
      setStageSelected(value.label);
    }
  }

  // function handleChangeSelectDays(event) {
  //   setDays(event.target.value);
  // }

  // function handleDateChange(date) {
  //   console.log(date);
  // }

  // const handleShiftChange = (event) => {
  //   event.target.checked ? setShiftChart('CD') : setShiftChart('CN');
  // };

  const handleDaysChange = (event) => {
    let value = parseInt(event.target.value, 10);
    if (value > 30) {
      value = 30;
    } else if (value < 1) {
      value = 1;
    }

    setDaysInput(value);
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
          id="combo-box-stage"
          options={Object.keys(stageMachines)}
          isOptionEqualToValue={(option, value) => {
            return option.label === value;
          }}
          value={Object.keys(stageMachines).length > 0 ? stageSelected : null}
          sx={{ width: '100%' }}
          onChange={handleValueChange}
          renderInput={(params) => <TextField {...params} label={translate('Select stage')} />}
        />
      </Grid>
      {/* <Grid item xs={12} md={6} lg={6}>
        {idMachine !== 0 && machineNames.length > 0 ? (
          <ResetForm
            id={idMachine}
            machineName={machineNames[sttMachine].label}
            plcModel={machineNames[sttMachine].plc}
            plcAddress={machineNames[sttMachine].address}
          />
        ) : null}
      </Grid> */}
      {/* <InformArea stage={idMachine} /> */}
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={8} lg={9}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">{translate('Timeline chart of activities')}</Typography>
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
                <FormControlLabel control={<MaterialUISwitch defaultChecked={false} onChange={handleShiftChange} />} />
              </FormGroup>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            {/* <OperationTimeChart id={idMachine} shift={shiftChart} daysNum={daysChart} maxDate={specifiedMaxDate} /> */}
          </Box>
        </MainCard>
      </Grid>
      {/* <Grid item xs={12} md={4} lg={3}>
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
      </Grid> */}

      {/* row 3 */}
      {/* <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">{translate('Machine data')}</Typography>
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
                maxDate={specifiedMaxDate}
              />
            </Box>
            <DatePicker
              label={translate('End date')}
              value={selectedEndDate}
              onChange={(date) => {
                setSelectedEndDate(date);
              }}
              minDate={specifiedMinDate}
              maxDate={specifiedMaxDate}
            />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

// StageInformation.propTypes = {
//   id: PropTypes.number,
// };

export default StageInformation;
