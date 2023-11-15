import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import ROSLIB from 'roslib';
import { ButtonBase } from '@mui/material';

import RosPropsContext from 'context/RosPropsContext';
import SignalLight from 'components/SignalLight';
import { activeItem } from 'store/reducers/menu';
import menuItems from 'menu-items';

function SignalLightsLayout({ width, height }) {
  const [colors, setColors] = useState([]);
  const [ids, setIds] = useState([]);

  const ros = useContext(RosPropsContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dashboardUrl = menuItems.items[0].children[1].url;
  const dashboardId = menuItems.items[0].children[1].id;

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
      setIds(data.id_machines);
    }
    return () => {
      listener.unsubscribe();
    };
  }, []);

  const redirectToDashboard = (id, stt) => {
    // console.log(id);
    dispatch(activeItem({ openItem: [dashboardId] }));
    navigate(dashboardUrl, {
      state: {
        id,
        stt,
      },
    });
  };

  return (
    <div>
      {/* GS01 */}
      <ButtonBase
        machineid={ids[0] || null}
        stt={0}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 35.55) / 100}px`, top: `${(height * 3.4) / 100}px` }}
      >
        <SignalLight color={colors[0] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GS02 */}
      <ButtonBase
        machineid={ids[1] || null}
        stt={1}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 24) / 100}px`, top: `${(height * 3.4) / 100}px` }}
      >
        <SignalLight color={colors[1] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GS03 */}
      <ButtonBase
        machineid={ids[2] || null}
        stt={2}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 47.09) / 100}px`, top: `${(height * 3.4) / 100}px` }}
      >
        <SignalLight color={colors[2] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GS04 */}
      <ButtonBase
        machineid={ids[3] || null}
        stt={3}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 29.76) / 100}px`, top: `${(height * 3.4) / 100}px` }}
      >
        <SignalLight color={colors[3] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GS05 */}
      <ButtonBase
        machineid={ids[4] || null}
        stt={4}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 30.45) / 100}px`, top: `${(height * 22.2) / 100}px` }}
      >
        <SignalLight color={colors[4] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* Empty */}

      {/* GS07 */}
      <ButtonBase
        machineid={ids[6] || null}
        stt={6}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 24.9) / 100}px`, top: `${(height * 21.5) / 100}px` }}
      >
        <SignalLight color={colors[6] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GS08 */}
      <ButtonBase
        machineid={ids[7] || null}
        stt={7}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 41.33) / 100}px`, top: `${(height * 3.4) / 100}px` }}
      >
        <SignalLight color={colors[7] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GR2 */}
      <ButtonBase
        machineid={ids[8] || null}
        stt={8}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 36.64) / 100}px`, top: `${(height * 31.2) / 100}px` }}
      >
        <SignalLight color={colors[8] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GR4 */}
      <ButtonBase
        machineid={ids[9] || null}
        stt={9}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 41.95) / 100}px`, top: `${(height * 31.2) / 100}px` }}
      >
        <SignalLight color={colors[9] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GC1 */}
      <ButtonBase
        machineid={ids[10] || null}
        stt={10}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 26.55) / 100}px`, top: `${(height * 32.15) / 100}px` }}
      >
        <SignalLight color={colors[10] || 'off'} size={`${(width * 1.8) / 100}`} custom="layout" />
      </ButtonBase>

      {/* GC2 */}
      <ButtonBase
        machineid={ids[11] || null}
        stt={11}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 31.25) / 100}px`, top: `${(height * 32.15) / 100}px` }}
      >
        <SignalLight color={colors[11] || 'off'} size={`${(width * 1.8) / 100}`} custom="layout" />
      </ButtonBase>

      {/* LN1 */}
      <ButtonBase
        machineid={ids[12] || null}
        stt={12}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 60.12) / 100}px`, top: `${(height * 33.5) / 100}px` }}
      >
        <SignalLight color={colors[12] || 'off'} size={`${(width * 1.8) / 100}`} custom="layout" />
      </ButtonBase>

      {/* LN2 */}
      <ButtonBase
        machineid={ids[13] || null}
        stt={13}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 52.43) / 100}px`, top: `${(height * 33.5) / 100}px` }}
      >
        <SignalLight color={colors[13] || 'off'} size={`${(width * 1.8) / 100}`} custom="layout" />
      </ButtonBase>

      {/* MC01 */}
      <ButtonBase
        machineid={ids[14] || null}
        stt={14}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 60.77) / 100}px`, top: `${(height * 5) / 100}px` }}
      >
        <SignalLight color={colors[14] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>

      {/* MC02 */}
      <ButtonBase
        machineid={ids[15] || null}
        stt={15}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{ position: 'absolute', left: `${(width * 54.1) / 100}px`, top: `${(height * 5) / 100}px` }}
      >
        <SignalLight color={colors[15] || 'off'} size={`${(width * 2) / 100}`} custom="layout" />
      </ButtonBase>
    </div>
  );
}

SignalLightsLayout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default SignalLightsLayout;
