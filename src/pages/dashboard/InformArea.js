import PropTypes from 'prop-types';
import { useState, useEffect, useContext, Fragment } from 'react';
import ROSLIB from 'roslib';
import { Grid, Box, Stack, Typography } from '@mui/material';

import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';
import MainCard from 'components/MainCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function InformArea({ id }) {
  const { translate } = useLocales();
  const [dataMachine, setDataMachine] = useState({
    shift: 0,
    noloadTime: { hours: '00', minutes: '00' },
    underloadTime: { hours: '00', minutes: '00' },
    offTime: { hours: '00', minutes: '00' },
    // gt: { min: 0, max: 0, current: 0 },
    // timeReachspeed: 0,
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
      let dataNew = {
        shift: 0,
        noloadTime: { hours: 0, minutes: 0 },
        underloadTime: { hours: 0, minutes: 0 },
        offTime: { hours: 0, minutes: 0 },
      };

      const sttMachine = data.id_machines.findIndex((id_machine) => id_machine === id);
      if (sttMachine === -1) {
        console.log('ID not found!');
        return;
      }

      const noload = {
        hours: Math.floor(data.state_machines[sttMachine].noload / 60),
        mins: data.state_machines[sttMachine].noload % 60,
      };

      const underload = {
        hours: Math.floor(data.state_machines[sttMachine].underload / 60),
        mins: data.state_machines[sttMachine].underload % 60,
      };

      const offtime = {
        hours: Math.floor(data.state_machines[sttMachine].offtime / 60),
        mins: data.state_machines[sttMachine].offtime % 60,
      };

      dataNew.shift = data.shift;
      dataNew.noloadTime.hours = noload.hours < 10 ? `0${noload.hours}` : `${noload.hours}`;
      dataNew.noloadTime.minutes = noload.mins < 10 ? `0${noload.mins}` : `${noload.mins}`;
      dataNew.underloadTime.hours = underload.hours < 10 ? `0${underload.hours}` : `${underload.hours}`;
      dataNew.underloadTime.minutes = underload.mins < 10 ? `0${underload.mins}` : `${underload.mins}`;
      dataNew.offTime.hours = offtime.hours < 10 ? `0${offtime.hours}` : `${offtime.hours}`;
      dataNew.offTime.minutes = offtime.mins < 10 ? `0${offtime.mins}` : `${offtime.mins}`;
      // dataNew.gt.min = data.state_machines[sttMachine].value_setting.min;
      // dataNew.gt.max = data.state_machines[sttMachine].value_setting.max;
      // dataNew.gt.current = data.state_machines[sttMachine].value_setting.current;
      // dataNew.timeReachSpeed = data.state_machines[sttMachine].time_reachspeed;

      setDataMachine(dataNew);
    }

    return () => {
      listener.unsubscribe();
    };
  }, [id]);

  return (
    <Fragment>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <MainCard contentSX={{ p: 2.25 }}>
          <Stack spacing={0.5} sx={{ position: 'relative' }}>
            <Typography variant="h6" color="textSecondary">
              {translate('SHIFT')}
            </Typography>
            <Grid container alignItems="center">
              <Grid item>
                <Typography variant="h4" color="inherit">
                  {dataMachine.shift ? translate('Night shift') : translate('Day shift')}
                </Typography>
              </Grid>
            </Grid>
            <div style={{ position: 'absolute', right: '10px', top: '6px' }}>
              {dataMachine.shift ? (
                <FontAwesomeIcon icon={faMoon} size="4x" beat />
              ) : (
                <FontAwesomeIcon icon={faSun} size="4x" color="#F5EB42" spin />
              )}
            </div>
          </Stack>
          <Box sx={{ pt: 2.25 }}>
            <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'right' }}></Typography>
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title={translate('No-load operating time')}
          desc={`${dataMachine.noloadTime.hours} h : ${dataMachine.noloadTime.minutes} m`}
          time="         "
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title={translate('Underload operating time')}
          desc={`${dataMachine.underloadTime.hours} h : ${dataMachine.underloadTime.minutes} m`}
          time="         "
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title={translate('Shutdown time')}
          // desc={`Min: ${dataMachine.gt.min} - Max: ${dataMachine.gt.max} - Hiện tại: ${dataMachine.gt.current}`}
          desc={`${dataMachine.offTime.hours} h : ${dataMachine.offTime.minutes} m`}
          time="         "
        />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Giá trị cài đặt"
          // desc={`Min: ${dataMachine.gt.min} - Max: ${dataMachine.gt.max} - Hiện tại: ${dataMachine.gt.current}`}
          desc={'No information'}
          time="         "
        />
      </Grid> */}
    </Fragment>
  );
}

InformArea.propTypes = {
  id: PropTypes.number,
};

export default InformArea;
