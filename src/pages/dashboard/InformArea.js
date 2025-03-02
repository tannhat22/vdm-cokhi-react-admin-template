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

function InformArea({ id, stage, dataType }) {
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

  const formatAndPadTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return {
      hours: hours < 10 ? `0${hours}` : `${hours}`,
      minutes: mins < 10 ? `0${mins}` : `${mins}`,
    };
  };

  useEffect(() => {
    const listener = new ROSLIB.Topic({
      ros: ros,
      name: '/state_machines',
      messageType: 'vdm_machine_msgs/MachinesStateStamped',
    });

    const subscription_callback = function (message) {
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
      const sttData =
        dataType === 'machine'
          ? data.id_machines.findIndex((id_machine) => id_machine === id)
          : data.overral_machines.findIndex((overral_machine) => overral_machine.type === stage);

      if (sttData === -1) {
        console.log(dataType === 'machine' ? 'ID not found!' : 'Stage not found!');
        return;
      }

      dataNew.shift = data.shift;
      if (dataType === 'machine') {
        dataNew.noloadTime = formatAndPadTime(data.state_machines[sttData].noload);
        dataNew.underloadTime = formatAndPadTime(data.state_machines[sttData].underload);
        dataNew.offTime = formatAndPadTime(data.state_machines[sttData].offtime);
      } else {
        dataNew.noloadTime = formatAndPadTime(data.overral_machines[sttData].noload);
        dataNew.underloadTime = formatAndPadTime(data.overral_machines[sttData].underload);
        dataNew.offTime = formatAndPadTime(data.overral_machines[sttData].offtime);
      }

      setDataMachine(dataNew);
    }

    return () => {
      listener.unsubscribe();
    };
  }, [id, stage, dataType]);

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
  stage: PropTypes.string,
  dataType: PropTypes.string,
};

export default InformArea;
