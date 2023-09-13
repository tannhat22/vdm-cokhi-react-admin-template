import React from 'react';
// material-ui
import { Box, Typography } from '@mui/material';
// import { Box, Typography, useMediaQuery } from '@mui/material';
// import { Box, IconButton, Link, useMediaQuery } from '@mui/material';
// import { GithubOutlined } from '@ant-design/icons';

// project import
// import Search from './Search';
// import Profile from './Profile';
// import Notification from './Notification';
// import MobileSection from './MobileSection';
import RosPropsContext from 'context/RosPropsContext';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  // const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [connected, setConnected] = React.useState(false);
  const [error, setError] = React.useState(false);
  // const [toastMes, setToastMes] = React.useState(false);

  const ros = React.useContext(RosPropsContext);

  React.useEffect(() => {
    ros.on('connection', function () {
      setConnected(true);
      setError(false);
      // setToastMes(true);
    });

    ros.on('error', function (error) {
      console.log(error);
      setError(true);
      setConnected(false);
      // setToastMes(true);
    });

    ros.on('close', function () {
      // setError(true);
      setConnected(false);
      // setToastMes(true);
    });
  }, []);
  return (
    <>
      {/* {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />} */}
      <Box sx={{ width: '100%', ml: 1 }}>
        <Typography sx={{ fontWeight: 500 }} color="primary">
          VDM Mechanical Department
        </Typography>
        {connected ? (
          <Typography sx={{ fontSize: '0.7rem' }} color="success.main">
            <span style={{ color: '#000' }}>Status:</span> connection OK!
          </Typography>
        ) : error ? (
          <Typography sx={{ fontSize: '0.7rem' }} color="error.main">
            <span style={{ color: '#000' }}>Status:</span> connection error!
          </Typography>
        ) : (
          <Typography sx={{ fontSize: '0.7rem' }} color="error.main">
            <span style={{ color: '#000' }}>Status:</span> connection error!
          </Typography>
        )}
      </Box>
      {/* Add by Tan Nhat */}

      {/* <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton> */}

      {/* <Notification /> */}
      {/* {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />} */}
    </>
  );
};

export default HeaderContent;
