// import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from 'react';
import ROSLIB from 'roslib';

// material-ui
import { Autocomplete, Grid, TextField } from '@mui/material';

// project import
import OeeRealTimeArea from './OeeRealTimeArea';
import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
const StageAnalysis = () => {
  const { translate } = useLocales();

  const [stageSelected, setStageSelected] = useState('');
  const [stageMachines, setStageMachines] = useState([]);
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
      let allStage = [];
      if (result.success) {
        for (let i = 0; i < result.machines_quantity; i++) {
          if (!allStage.includes(result.machines_type[i])) {
            allStage.push(result.machines_type[i]);
          }
        }
        setStageMachines(allStage);
      }
      // console.log(result.success);
      // console.log('da phan hoi');
    });
  }, []);

  function handleValueChange(event, value, reason) {
    if (reason === 'selectOption') {
      setStageSelected(value);
    }
  }

  return (
    <Grid container rowSpacing={2.5} columnSpacing={2.5}>
      <Grid item xs={12} md={12} lg={12}>
        <Autocomplete
          disablePortal
          id="combo-box-stage"
          options={stageMachines}
          isOptionEqualToValue={(option, value) => {
            return option === value;
          }}
          value={stageMachines.length > 0 && stageSelected != '' ? stageSelected : null}
          sx={{ width: '100%' }}
          onChange={handleValueChange}
          renderInput={(params) => <TextField {...params} label={translate('Chọn công đoạn')} />}
        />
      </Grid>
      <OeeRealTimeArea stage={stageSelected} />
    </Grid>
  );
};

// StageAnalysis.propTypes = {
//   id: PropTypes.number,
// };

export default StageAnalysis;
