import PropTypes from 'prop-types';
import { useState, useEffect, useContext, Fragment } from 'react';
import ROSLIB from 'roslib';
import { Grid } from '@mui/material';

import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import RosPropsContext from 'context/RosPropsContext';

function InformArea({ id }) {
  const [dataMachine, setDataMachine] = useState({
    noloadTime: { hours: '00', minutes: '00' },
    underloadTime: { hours: '00', minutes: '00' },
    gt: { min: 0, max: 0, current: 0 },
    timeReachspeed: 0,
  });

  const ros = useContext(RosPropsContext);

  useEffect(() => {
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: '/state_machines',
      messageType: 'vdm_cokhi_machine_msgs/StateMachinesStamped',
    });

    let subscription_callback = function (message) {
      handleDataWebsocket(message);
    };

    listener.subscribe(subscription_callback);

    function handleDataWebsocket(data) {
      let dataNew = {
        noloadTime: { hours: 0, minutes: 0 },
        underloadTime: { hours: 0, minutes: 0 },
        gt: { min: 0, max: 0, current: 0 },
        timeReachspeed: 0,
      };

      const noload = {
        hours: Math.floor(data.state_machines[id - 1].noload / 60),
        mins: data.state_machines[id - 1].noload % 60,
      };

      const underload = {
        hours: Math.floor(data.state_machines[id - 1].underload / 60),
        mins: data.state_machines[id - 1].underload % 60,
      };

      dataNew.noloadTime.hours = noload.hours < 10 ? `0${noload.hours}` : `${noload.hours}`;
      dataNew.noloadTime.minutes = noload.mins < 10 ? `0${noload.mins}` : `${noload.mins}`;
      dataNew.underloadTime.hours = underload.hours < 10 ? `0${underload.hours}` : `${underload.hours}`;
      dataNew.underloadTime.minutes = underload.mins < 10 ? `0${underload.mins}` : `${underload.mins}`;
      dataNew.gt.min = data.state_machines[id - 1].value_setting.min;
      dataNew.gt.max = data.state_machines[id - 1].value_setting.max;
      dataNew.gt.current = data.state_machines[id - 1].value_setting.current;
      dataNew.timeReachSpeed = data.state_machines[id - 1].time_reachspeed;

      setDataMachine(dataNew);
    }

    return () => {
      listener.unsubscribe();
    };
  }, []);

  return (
    <Fragment>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="No-load operating time"
          desc={`${dataMachine.noloadTime.hours} h : ${dataMachine.noloadTime.minutes} m`}
          time="Time: 25/9/2023 17:55"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Under load operating time"
          desc={`${dataMachine.underloadTime.hours} h : ${dataMachine.underloadTime.minutes} m`}
          time="Time: 25/9/2023 17:55"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="GT"
          desc={`Min: ${dataMachine.gt.min} - Max: ${dataMachine.gt.max} - Current: ${dataMachine.gt.current}`}
          time="Time: 25/9/2023 17:55"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Time to reach speed"
          desc={`${dataMachine.timeReachspeed} ms`}
          time="Time: 25-9-2023 17:55"
        />
      </Grid>
    </Fragment>
  );
}

InformArea.propTypes = {
  id: PropTypes.number,
};

export default InformArea;
