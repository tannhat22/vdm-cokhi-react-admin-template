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

import gs1 from 'assets/images/machines/GS1-GS8.jpg';
// import gs7 from 'assets/images/machines/GS7.jpg';
// import gr2 from 'assets/images/machines/GR2.jpg';
// import gr4 from 'assets/images/machines/GR4.jpg';
// import gc1 from 'assets/images/machines/GC1-2.jpg';
// import ln1 from 'assets/images/machines/LN1.jpg';
// import ln2 from 'assets/images/machines/LN2.jpg';
// import mc1 from 'assets/images/machines/MC1-MC2.jpg';

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
  // const [colors, setColors] = useState([]);
  // const [ids, setIds] = useState([]);

  const [data, setData] = useState([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]);

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
      let dataShow = [];
      for (let i = 0; i < data.machines_quantity; i++) {
        switch (data.state_machines[i].signal_light) {
          case 1:
            dataShow.push([
              data.id_machines[i],
              data.state_machines[i].name,
              data.state_machines[i].noload,
              data.state_machines[i].underload,
              data.state_machines[i].offtime,
              'green',
            ]);
            // colorsData.push('green');
            break;
          case 2:
            dataShow.push([
              data.id_machines[i],
              data.state_machines[i].name,
              data.state_machines[i].noload,
              data.state_machines[i].underload,
              data.state_machines[i].offtime,
              'yellow',
            ]);
            // colorsData.push('yellow');
            break;
          case 3:
            dataShow.push([
              data.id_machines[i],
              data.state_machines[i].name,
              data.state_machines[i].noload,
              data.state_machines[i].underload,
              data.state_machines[i].offtime,
              'red',
            ]);
            // colorsData.push('red');
            break;
          default:
            dataShow.push([
              data.id_machines[i],
              data.state_machines[i].name,
              data.state_machines[i].noload,
              data.state_machines[i].underload,
              data.state_machines[i].offtime,
              'off',
            ]);
          // colorsData.push('off');
        }
      }
      setData(dataShow);
      // setColors(colorsData);
      // setIds(data.id_machines);
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
      <HtmlTooltip
        title={
          <Card sx={{ maxWidth: 900, display: 'flex', border: '1px solid #dadde9' }}>
            <CardMedia
              component="img"
              sx={{ maxHeight: 500, maxWidth: 500, objectFit: 'cover' }}
              image={gs1}
              title={data[0][1] || 'no info'}
            />
            <CardContent sx={{ minWidth: 360 }}>
              <Typography gutterBottom variant="h3" component="div" color="primary">
                Tên máy: <span style={{ color: '#1C2025' }}>{data[0][1] || 'no info'}</span>
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '5px' }}>
                Thời gian chạy không tải (phút): <span style={{ color: 'black' }}>{data[0][2] || 'no info'}</span>
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '5px' }}>
                Thời gian chạy có tải(phút): {data[0][3] || 'no info'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '5px' }}>
                Thời gian tắt máy(phút): {data[0][4] || 'no info'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '5px' }}>
                Loại máy: GS
              </Typography>
            </CardContent>
          </Card>
        }
      >
        <ButtonBase
          machineid={data[0][0] || null}
          stt={0}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 34.75) / 100}px`, top: `${(height * 4.3) / 100}px` }}
        >
          <SignalLight color={data[0][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GS02 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[1][0] || null}
          stt={1}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 23.82) / 100}px`, top: `${(height * 4.3) / 100}px` }}
        >
          <SignalLight color={data[1][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GS03 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[2][0] || null}
          stt={2}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 45.67) / 100}px`, top: `${(height * 4.3) / 100}px` }}
        >
          <SignalLight color={data[2][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GS04 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[3][0] || null}
          stt={3}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 29.3) / 100}px`, top: `${(height * 4.3) / 100}px` }}
        >
          <SignalLight color={data[3][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GS05 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[4][0] || null}
          stt={4}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 29.9) / 100}px`, top: `${(height * 23.3) / 100}px` }}
        >
          <SignalLight color={data[4][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* Empty */}

      {/* GS07 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[6][0] || null}
          stt={6}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 24) / 100}px`, top: `${(height * 22.4) / 100}px` }}
        >
          <SignalLight color={data[6][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GS08 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[7][0] || null}
          stt={7}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 40.23) / 100}px`, top: `${(height * 4.3) / 100}px` }}
        >
          <SignalLight color={data[7][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GR2 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[8][0] || null}
          stt={8}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 35.86) / 100}px`, top: `${(height * 31.8) / 100}px` }}
        >
          <SignalLight color={data[8][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GR4 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[9][0] || null}
          stt={9}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 41.23) / 100}px`, top: `${(height * 31.8) / 100}px` }}
        >
          <SignalLight color={data[9][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GC1 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[10][0] || null}
          stt={10}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 25.57) / 100}px`, top: `${(height * 32.6) / 100}px` }}
        >
          <SignalLight color={data[10][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* GC2 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[11][0] || null}
          stt={11}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 30.29) / 100}px`, top: `${(height * 32.6) / 100}px` }}
        >
          <SignalLight color={data[11][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* LN1 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[12][0] || null}
          stt={12}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 59.38) / 100}px`, top: `${(height * 32.58) / 100}px` }}
        >
          <SignalLight color={data[12][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* LN2 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[13][0] || null}
          stt={13}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 51.68) / 100}px`, top: `${(height * 32.58) / 100}px` }}
        >
          <SignalLight color={data[13][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

      {/* MC01 */}
      <HtmlTooltip>
        <ButtonBase
          machineid={data[14][0] || null}
          stt={14}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 60.12) / 100}px`, top: `${(height * 6.5) / 100}px` }}
        >
          <SignalLight color={data[14][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
        </ButtonBase>
      </HtmlTooltip>

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
          machineid={data[15][0] || null}
          stt={15}
          onClick={(event) => {
            redirectToDashboard(
              Number(event.currentTarget.getAttribute('machineid')),
              Number(event.currentTarget.getAttribute('stt')),
            );
          }}
          style={{ position: 'absolute', left: `${(width * 53.53) / 100}px`, top: `${(height * 6.5) / 100}px` }}
        >
          <SignalLight color={data[15][5] || 'off'} size={`${(width * 2.5) / 100}`} custom="layout" />
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
