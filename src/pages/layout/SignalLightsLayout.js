import React from 'react';
import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import ROSLIB from 'roslib';
// import { Button } from '@mui/material';

import RosPropsContext from 'context/RosPropsContext';
import SignalLight from 'components/SignalLight';

function SignalLightsLayout({ width, height }) {
  const [colors, setColors] = useState([]);
  // const [ids, setIds] = useState([]);

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
      let colorsData = [];
      for (let i = 0; i < data.machines_quantity; i++) {
        switch (data.state_machines[i].signal_light) {
          case 1:
            colorsData.push('green');
            break;
          case 2:
            colorsData.push('yellow');
            break;
          case 3:
            colorsData.push('red');
            break;
          default:
            colorsData.push('off');
        }
      }

      setColors(colorsData);
      // setIds(data.id_machines);
    }
    return () => {
      listener.unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* GS01 */}
      <div style={{ position: 'absolute', left: `${(width * 35.55) / 100}px`, top: `${(height * 3.4) / 100}px` }}>
        <SignalLight color={colors[0] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* GS02 */}
      <div style={{ position: 'absolute', left: `${(width * 24) / 100}px`, top: `${(height * 3.4) / 100}px` }}>
        <SignalLight color={colors[1] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* GS03 */}
      <div style={{ position: 'absolute', left: `${(width * 47.09) / 100}px`, top: `${(height * 3.4) / 100}px` }}>
        <SignalLight color={colors[2] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* GS04 */}
      <div style={{ position: 'absolute', left: `${(width * 29.76) / 100}px`, top: `${(height * 3.4) / 100}px` }}>
        <SignalLight color={colors[3] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* GS05 */}
      <div style={{ position: 'absolute', left: `${(width * 30.45) / 100}px`, top: `${(height * 22.2) / 100}px` }}>
        <SignalLight color={colors[4] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* Empty */}

      {/* GS07 */}
      <div style={{ position: 'absolute', left: `${(width * 24.9) / 100}px`, top: `${(height * 21.5) / 100}px` }}>
        <SignalLight color={colors[6] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* GS08 */}
      <div style={{ position: 'absolute', left: `${(width * 41.33) / 100}px`, top: `${(height * 3.4) / 100}px` }}>
        <SignalLight color={colors[7] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* GR2 */}
      <div style={{ position: 'absolute', left: `${(width * 36.64) / 100}px`, top: `${(height * 31.2) / 100}px` }}>
        <SignalLight color={colors[8] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* GR4 */}
      <div style={{ position: 'absolute', left: `${(width * 41.95) / 100}px`, top: `${(height * 31.2) / 100}px` }}>
        <SignalLight color={colors[9] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* GC1 */}
      <div style={{ position: 'absolute', left: `${(width * 26.55) / 100}px`, top: `${(height * 32.15) / 100}px` }}>
        <SignalLight color={colors[10] || 'off'} size={`${(width * 1.8) / 100}`} custom="layout" />
      </div>

      {/* GC2 */}
      <div style={{ position: 'absolute', left: `${(width * 31.25) / 100}px`, top: `${(height * 32.15) / 100}px` }}>
        <SignalLight color={colors[11] || 'off'} size={`${(width * 1.8) / 100}`} custom="layout" />
      </div>

      {/* LN1 */}
      <div style={{ position: 'absolute', left: `${(width * 60.12) / 100}px`, top: `${(height * 33.5) / 100}px` }}>
        <SignalLight color={colors[12] || 'off'} size={`${(width * 1.8) / 100}`} custom="layout" />
      </div>

      {/* LN2 */}
      <div style={{ position: 'absolute', left: `${(width * 52.43) / 100}px`, top: `${(height * 33.5) / 100}px` }}>
        <SignalLight color={colors[13] || 'off'} size={`${(width * 1.8) / 100}`} custom="layout" />
      </div>

      {/* MC01 */}
      <div style={{ position: 'absolute', left: `${(width * 60.77) / 100}px`, top: `${(height * 5) / 100}px` }}>
        <SignalLight color={colors[14] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>

      {/* MC02 */}
      <div style={{ position: 'absolute', left: `${(width * 54.1) / 100}px`, top: `${(height * 5) / 100}px` }}>
        <SignalLight color={colors[15] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </div>
    </div>
  );
}

SignalLightsLayout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default SignalLightsLayout;
