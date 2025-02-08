import PropTypes from 'prop-types';
import { useState, useEffect, useContext, Fragment } from 'react';
import ROSLIB from 'roslib';
import { Grid, Box } from '@mui/material';

import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';
import MainCard from 'components/MainCard';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import ColumnChart from './ColumnChart';

function OeeRealTimeArea({ stage, machines }) {
  const { translate } = useLocales();
  const [machinesData, setMachinesData] = useState({});
  const [seriesData, setSeriesData] = useState({
    availability: [],
    performance: [],
    quality: [],
  });

  const ros = useContext(RosPropsContext);
  // console.log('re-render');

  useEffect(() => {
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
      const stageMachineObj = {};

      data.state_machines.forEach((machine) => {
        if (machine.type === stage) {
          stageMachineObj[machine.name] = machine;
        }
      });

      setMachinesData(stageMachineObj);
    }

    return () => {
      listener.unsubscribe();
    };
  }, [stage]);

  return (
    <Fragment>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <ColumnChart />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <ColumnChart />
          </Box>
        </MainCard>
      </Grid>
      {/* <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}></Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}></Box>
        </MainCard>
      </Grid> */}
    </Fragment>
  );
}

OeeRealTimeArea.propTypes = {
  stage: PropTypes.string.isRequired,
  machines: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default OeeRealTimeArea;
