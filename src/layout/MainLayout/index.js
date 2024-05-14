import { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
// import { useTheme } from '@mui/material/styles';
// import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { Box, Toolbar } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// types
import { openDrawer } from 'store/reducers/menu';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  // const theme = useTheme();
  // const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

  const dispatch = useDispatch();

  const mouseEnterRef = useRef(false);

  const { drawerOpen } = useSelector((state) => state.menu);

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const [mouseEnter, setMouseEnter] = useState(false);

  const handleDrawerToggle = () => {
    // console.log('Event trigger');
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };
  let timeoutID;
  const handleDrawerMouseLeave = () => {
    setMouseEnter(false);
    if (open) {
      timeoutID = setTimeout(() => {
        if (!mouseEnterRef.current) {
          setOpen(false);
          dispatch(openDrawer({ drawerOpen: false }));
        }
      }, 3000);
    }
  };

  const handleDrawerMouseEnter = () => {
    setMouseEnter(true);
    clearTimeout(timeoutID);
  };

  useEffect(() => {
    // THIS IS THE MAGIC PART
    mouseEnterRef.current = mouseEnter;
  }, [mouseEnter]);

  // set media wise responsive drawer
  // useEffect(() => {
  //   setOpen(!matchDownLG);
  //   dispatch(openDrawer({ drawerOpen: !matchDownLG }));

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Drawer
        open={open}
        handleDrawerToggle={handleDrawerToggle}
        handleDrawerMouseLeave={handleDrawerMouseLeave}
        handleDrawerMouseEnter={handleDrawerMouseEnter}
      />
      <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
