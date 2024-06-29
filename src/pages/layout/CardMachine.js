import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import ROSLIB from 'roslib';
// import { ButtonBase, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { ButtonBase, Card, CardMedia, CardContent, Typography, Popover } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import RosPropsContext from 'context/RosPropsContext';
import SignalLight from 'components/SignalLight';
import { activeItem } from 'store/reducers/menu';
import menuItems from 'menu-items';
import { useLocales } from 'locales';

// const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(() => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: '#f5f5f9',
//     // color: 'rgba(0, 0, 0, 0.87)',
//     maxWidth: 800,
//     maxHeight: 500,
//     // fontSize: theme.typography.pxToRem(12),
//     // border: '1px solid #dadde9',
//     padding: 0,
//     margin: 0,
//   },
// }));

function CardMachine({ stt, machineId, posLeft, posTop, size, img }) {
  const { translate } = useLocales();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [machineData, setMachineData] = useState([]);
  const [typeData, setTypeData] = useState([]);

  const ros = useContext(RosPropsContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dashboardUrl = menuItems.items[0].children[2].url;
  const dashboardId = menuItems.items[0].children[2].id;

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
    // <HtmlTooltip
    //   // sx={{ maxWidth: 900 }}
    //   title={
    //     <Card sx={{ minWidth: 960, display: 'flex', border: '1px solid #dadde9', position: 'relative' }}>
    //       <CardMedia
    //         component="img"
    //         sx={{ maxHeight: 580, maxWidth: 580, objectFit: 'cover' }}
    //         image={img}
    //         title={machineData[1] || 'no info'}
    //       />
    //       <CardContent sx={{ minWidth: 360 }}>
    //         <Typography gutterBottom variant="h3" component="div" color="primary">
    //           {translate('Machine name')}: <span style={{ color: '#1C2025' }}>{machineData[1] || 'no info'}</span>
    //         </Typography>
    //         <div style={{ position: 'absolute', top: '6px', right: '18px' }}>
    //           <SignalLight color={machineData[6] || 'off'} />
    //         </div>
    //         <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
    //           {translate('Operating status')}:{' '}
    //           <span style={{ color: '#212121' }}>
    //             {machineData[6] === 'green'
    //               ? translate('Underload')
    //               : machineData[6] === 'yellow'
    //               ? translate('No-load')
    //               : machineData[6] === 'red'
    //               ? translate('Overloading')
    //               : translate('Shutdown')}
    //           </span>
    //         </Typography>
    //         <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
    //           {translate('No-load operating time')}:{' '}
    //           <span style={{ color: '#212121' }}>
    //             {machineData[3] || machineData[3] === 0 ? `${machineData[3]} ${translate('min')}` : 'no info'}
    //           </span>
    //         </Typography>
    //         <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
    //           {translate('Underload operating time')}:{' '}
    //           <span style={{ color: '#212121' }}>
    //             {machineData[4] || machineData[4] === 0 ? `${machineData[4]} ${translate('min')}` : 'no info'}
    //           </span>
    //         </Typography>
    //         <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '50px' }}>
    //           {translate('Shutdown time')}:{' '}
    //           <span style={{ color: '#212121' }}>
    //             {machineData[5] || machineData[5] === 0 ? `${machineData[5]} ${translate('min')}` : 'no info'}
    //           </span>
    //         </Typography>

    //         <Typography gutterBottom variant="h3" component="div" color="primary">
    //           {translate('Process')}: <span style={{ color: '#1C2025' }}>{typeData[0] || 'no info'}</span>
    //         </Typography>
    //         <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
    //           {translate('Number of machines')}: <span style={{ color: '#212121' }}>{typeData[1] || 'no info'}</span>
    //         </Typography>
    //         <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
    //           {translate('Total no-load operating time')}:{' '}
    //           <span style={{ color: '#212121' }}>
    //             {typeData[2] || typeData[2] === 0 ? `${typeData[2]} ${translate('min')}` : 'no info'}
    //           </span>
    //         </Typography>
    //         <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
    //           {translate('Total underload operating time')}:{' '}
    //           <span style={{ color: '#212121' }}>
    //             {typeData[3] || typeData[3] === 0 ? `${typeData[3]} ${translate('min')}` : 'no info'}
    //           </span>
    //         </Typography>
    //         <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '50px' }}>
    //           {translate('Total shutdown time')}:{' '}
    //           <span style={{ color: '#212121' }}>
    //             {typeData[4] || typeData[4] === 0 ? `${typeData[4]} ${translate('min')}` : 'no info'}
    //           </span>
    //         </Typography>
    //       </CardContent>
    //     </Card>
    //   }
    // >
    //   <ButtonBase
    //     machineid={machineId || null}
    //     stt={stt}
    //     onClick={(event) => {
    //       redirectToDashboard(
    //         Number(event.currentTarget.getAttribute('machineid')),
    //         Number(event.currentTarget.getAttribute('stt')),
    //       );
    //     }}
    //     style={{
    //       position: 'absolute',
    //       left: `${posLeft / 100}px`,
    //       top: `${posTop / 100}px`,
    //     }}
    //   >
    //     <SignalLight color={machineData[6] || 'off'} size={`${size / 100}`} custom="layout" />
    //   </ButtonBase>
    // </HtmlTooltip>
    <p>
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
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <SignalLight color={machineData[6] || 'off'} size={`${size / 100}`} custom="layout" />
      </ButtonBase>
      <Popover
        id={`mouse-over-popover-${machineId}`}
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Card sx={{ minWidth: 960, display: 'flex', border: '1px solid #dadde9', position: 'relative' }}>
          <CardMedia
            component="img"
            sx={{ maxHeight: 580, maxWidth: 580, objectFit: 'cover' }}
            image={img}
            title={machineData[1] || 'no info'}
          />
          <CardContent sx={{ minWidth: 360 }}>
            <Typography gutterBottom variant="h3" component="div" color="primary">
              {translate('Machine name')}: <span style={{ color: '#1C2025' }}>{machineData[1] || 'no info'}</span>
            </Typography>
            <div style={{ position: 'absolute', top: '6px', right: '18px' }}>
              <SignalLight color={machineData[6] || 'off'} />
            </div>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              {translate('Operating status')}:{' '}
              <span style={{ color: '#212121' }}>
                {machineData[6] === 'green'
                  ? translate('Running with load')
                  : machineData[6] === 'yellow'
                  ? translate('Running without load')
                  : machineData[6] === 'red'
                  ? translate('Overloading')
                  : translate('Turn off machine')}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              {translate('No-load operating time')}:{' '}
              <span style={{ color: '#212121' }}>
                {machineData[3] || machineData[3] === 0 ? `${machineData[3]} ${translate('min')}` : 'no info'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              {translate('Underload operating time')}:{' '}
              <span style={{ color: '#212121' }}>
                {machineData[4] || machineData[4] === 0 ? `${machineData[4]} ${translate('min')}` : 'no info'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '50px' }}>
              {translate('Shutdown time')}:{' '}
              <span style={{ color: '#212121' }}>
                {machineData[5] || machineData[5] === 0 ? `${machineData[5]} ${translate('min')}` : 'no info'}
              </span>
            </Typography>

            <Typography gutterBottom variant="h3" component="div" color="primary">
              {translate('Process')}: <span style={{ color: '#1C2025' }}>{typeData[0] || 'no info'}</span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              {translate('Number of machines')}: <span style={{ color: '#212121' }}>{typeData[1] || 'no info'}</span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              {translate('Total no-load operating time')}:{' '}
              <span style={{ color: '#212121' }}>
                {typeData[2] || typeData[2] === 0 ? `${typeData[2]} ${translate('min')}` : 'no info'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '10px' }}>
              {translate('Total underload operating time')}:{' '}
              <span style={{ color: '#212121' }}>
                {typeData[3] || typeData[3] === 0 ? `${typeData[3]} ${translate('min')}` : 'no info'}
              </span>
            </Typography>
            <Typography variant="subtitle1" color="#616161" sx={{ marginBottom: '50px' }}>
              {translate('Total shutdown time')}:{' '}
              <span style={{ color: '#212121' }}>
                {typeData[4] || typeData[4] === 0 ? `${typeData[4]} ${translate('min')}` : 'no info'}
              </span>
            </Typography>
          </CardContent>
        </Card>
      </Popover>
    </p>
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
