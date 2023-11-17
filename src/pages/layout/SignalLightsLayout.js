import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import ROSLIB from 'roslib';
import { ButtonBase, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import RosPropsContext from 'context/RosPropsContext';
import SignalLight from 'components/SignalLight';
import { activeItem } from 'store/reducers/menu';
import menuItems from 'menu-items';

import gs1 from 'assets/images/machines/MC3.jpg';

const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    // color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 800,
    maxHeight: 500,
    // fontSize: theme.typography.pxToRem(12),
    // border: '1px solid #dadde9',
    padding: 0,
    margin: 0,
  },
}));

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
        style={{ position: 'absolute', left: `${(width * 34.75) / 100}px`, top: `${(height * 4.3) / 100}px` }}
      >
        <SignalLight color={colors[0] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 23.82) / 100}px`, top: `${(height * 4.3) / 100}px` }}
      >
        <SignalLight color={colors[1] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 45.67) / 100}px`, top: `${(height * 4.3) / 100}px` }}
      >
        <SignalLight color={colors[2] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 29.3) / 100}px`, top: `${(height * 4.3) / 100}px` }}
      >
        <SignalLight color={colors[3] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 29.9) / 100}px`, top: `${(height * 23.3) / 100}px` }}
      >
        <SignalLight color={colors[4] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 24) / 100}px`, top: `${(height * 22.4) / 100}px` }}
      >
        <SignalLight color={colors[6] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 40.23) / 100}px`, top: `${(height * 4.3) / 100}px` }}
      >
        <SignalLight color={colors[7] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 35.86) / 100}px`, top: `${(height * 31.8) / 100}px` }}
      >
        <SignalLight color={colors[8] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 41.23) / 100}px`, top: `${(height * 31.8) / 100}px` }}
      >
        <SignalLight color={colors[9] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 25.57) / 100}px`, top: `${(height * 32.6) / 100}px` }}
      >
        <SignalLight color={colors[10] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 30.29) / 100}px`, top: `${(height * 32.6) / 100}px` }}
      >
        <SignalLight color={colors[11] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 59.38) / 100}px`, top: `${(height * 32.58) / 100}px` }}
      >
        <SignalLight color={colors[12] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 51.68) / 100}px`, top: `${(height * 32.58) / 100}px` }}
      >
        <SignalLight color={colors[13] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
        style={{ position: 'absolute', left: `${(width * 60.12) / 100}px`, top: `${(height * 6.5) / 100}px` }}
      >
        <SignalLight color={colors[14] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
      </ButtonBase>

      {/* MC02 */}

      <HtmlTooltip
        title={
          <Card sx={{ maxWidth: 800, display: 'flex', border: '1px solid #dadde9' }}>
            <CardMedia
              component="img"
              sx={{ maxHeight: 500, maxWidth: 500, objectFit: 'cover' }}
              image={gs1}
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Lizard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all
                continents except Antarctica
              </Typography>
            </CardContent>
          </Card>
        }
      >
        <ButtonBase
          machineid={ids[15] || null}
          stt={15}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 53.53) / 100}px`, top: `${(height * 6.5) / 100}px` }}
        >
          <SignalLight color={colors[15] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>
    </div>
  );
}

SignalLightsLayout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default SignalLightsLayout;
