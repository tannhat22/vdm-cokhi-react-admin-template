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

function CardMachine({ stt, machineId, posLeft, posTop, size, img }) {
  const [machineData, setMachineData] = useState([]);
  const [typeData, setTypeData] = useState([]);

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
      // Lấy dữ liệu theo STT máy
      let dataMachine = [
        data.id_machines[stt],
        data.state_machines[stt].name,
        data.state_machines[stt].type,
        data.state_machines[stt].noload,
        data.state_machines[stt].underload,
        data.state_machines[stt].offtime,
        data.state_machines[stt].signal_light === 1
          ? 'green'
          : data.state_machines[stt].signal_light === 2
          ? 'yellow'
          : data.state_machines[stt].signal_light === 3
          ? 'red'
          : 'off',
      ];

      // Lấy dữ liệu theo loại máy
      let dataType;
      for (let i = 0; i < data.types_quantity; i++) {
        if (data.overral_machines[i].type === dataMachine[2]) {
          dataType = [
            data.overral_machines[i].type,
            data.overral_machines[i].quantity,
            data.overral_machines[i].noload,
            data.overral_machines[i].underload,
            data.overral_machines[i].offtime,
          ];
        }
      }

      setMachineData(dataMachine);
      setTypeData(dataType);
    }
    return () => {
      listener.unsubscribe();
    };
  }, [stt]);

  const redirectToDashboard = (id, stt) => {
    dispatch(activeItem({ openItem: [dashboardId] }));
    navigate(dashboardUrl, {
      state: {
        id,
        stt,
      },
    });
  };

  return (
    <HtmlTooltip
      // sx={{ maxWidth: 900 }}
      title={
        <Card sx={{ minWidth: 960, display: 'flex', border: '1px solid #dadde9', position: 'relative' }}>
          <CardMedia
            component="img"
            sx={{ maxHeight: 580, maxWidth: 580, objectFit: 'cover' }}
            image={img}
            title={machineData[1] || 'no info'}
          />
          <CardContent sx={{ minWidth: 360 }}>
            <Typography gutterBottom variant="h3" component="div" color="primary">
              Tên máy: <span style={{ color: '#1C2025' }}>{machineData[1] || 'no info'}</span>
            </Typography>
            <div style={{ position: 'absolute', top: '6px', right: '18px' }}>
              <SignalLight color={machineData[6] || 'off'} />
            </div>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              Trạng thái hoạt động:{' '}
              <span style={{ color: '#212121' }}>
                {machineData[6] === 'green'
                  ? 'Chạy Có Tải'
                  : machineData[6] === 'yellow'
                  ? 'Chạy Không Tải'
                  : machineData[6] === 'red'
                  ? 'Đang Quá Tải'
                  : 'Tắt Máy'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              Thời gian chạy không tải:{' '}
              <span style={{ color: '#212121' }}>
                {machineData[3] || machineData[3] === 0 ? `${machineData[3]} phút` : 'no info'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              Thời gian chạy có tải:{' '}
              <span style={{ color: '#212121' }}>
                {machineData[4] || machineData[4] === 0 ? `${machineData[4]} phút` : 'no info'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '50px' }}>
              Thời gian tắt máy:{' '}
              <span style={{ color: '#212121' }}>
                {machineData[5] || machineData[5] === 0 ? `${machineData[5]} phút` : 'no info'}
              </span>
            </Typography>

            <Typography gutterBottom variant="h3" component="div" color="primary">
              Công đoạn: <span style={{ color: '#1C2025' }}>{typeData[0] || 'no info'}</span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              Số lượng máy: <span style={{ color: '#212121' }}>{typeData[1] || 'no info'}</span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              Tổng thời gian chạy không tải:{' '}
              <span style={{ color: '#212121' }}>
                {typeData[2] || typeData[2] === 0 ? `${typeData[2]} phút` : 'no info'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              Tổng thời gian chạy có tải:{' '}
              <span style={{ color: '#212121' }}>
                {typeData[3] || typeData[3] === 0 ? `${typeData[3]} phút` : 'no info'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '50px' }}>
              Tổng thời gian tắt máy:{' '}
              <span style={{ color: '#212121' }}>
                {typeData[4] || typeData[4] === 0 ? `${typeData[4]} phút` : 'no info'}
              </span>
            </Typography>
          </CardContent>
        </Card>
      }
    >
      <ButtonBase
        machineid={machineId || null}
        stt={stt}
        onClick={(event) => {
          redirectToDashboard(
            Number(event.currentTarget.getAttribute('machineid')),
            Number(event.currentTarget.getAttribute('stt')),
          );
        }}
        style={{
          position: 'absolute',
          left: `${posLeft / 100}px`,
          top: `${posTop / 100}px`,
        }}
      >
        <SignalLight color={machineData[6] || 'off'} size={`${size / 100}`} custom="layout" />
      </ButtonBase>
    </HtmlTooltip>
  );
}

CardMachine.propTypes = {
  stt: PropTypes.number,
  machineId: PropTypes.number,
  posLeft: PropTypes.number,
  posTop: PropTypes.number,
  size: PropTypes.number,
  img: PropTypes.node,
};

export default CardMachine;
