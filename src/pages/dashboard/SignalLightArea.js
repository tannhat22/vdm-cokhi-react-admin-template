import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import ROSLIB from 'roslib';

// material-ui
import { Box } from '@mui/material';

// project import
import SignalLight from 'components/SignalLight';

import RosPropsContext from 'context/RosPropsContext';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const SignalLightArea = ({ id }) => {
  const [color, setColor] = useState('off');

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
      const sttMachine = data.id_machines.findIndex((id_machine) => {
        return id_machine === id;
      });
      if (sttMachine === -1) {
        console.log('ID not found!');
        return;
      }

      const signalLight = data.state_machines[sttMachine].signal_light;
      switch (signalLight) {
        case 1:
          setColor('green');
          break;
        case 2:
          setColor('yellow');
          break;
        case 3:
          setColor('red');
          break;
        default:
          setColor('off');
      }
    }

    return () => {
      listener.unsubscribe();
    };
  }, [id]);

  return (
    <Box>
      <div style={{ minHeight: '473px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            minHeight: '240px',
            minWidth: '80px',
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '10px',
          }}
        >
          {color === 'red' ? (
            <SignalLight color={color} size={'lg'}></SignalLight>
          ) : (
            <SignalLight color={'off'} size={'lg'}></SignalLight>
          )}
          {color === 'yellow' ? (
            <SignalLight color={color} size={'lg'}></SignalLight>
          ) : (
            <SignalLight color={'off'} size={'lg'}></SignalLight>
          )}
          {color === 'green' ? (
            <SignalLight color={color} size={'lg'}></SignalLight>
          ) : (
            <SignalLight color={'off'} size={'lg'}></SignalLight>
          )}
        </div>
      </div>
    </Box>
  );
};

SignalLightArea.propTypes = {
  id: PropTypes.number,
};

export default SignalLightArea;
