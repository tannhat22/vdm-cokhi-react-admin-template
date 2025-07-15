import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import layoutImg from 'assets/images/layout/layout-ck-vdm-new.jpg';
import { Box, Button, Divider, Typography, Grid } from '@mui/material';

import SignalLightsLayout from './SignalLightsLayout';
import SignalLight from 'components/SignalLight';
import { useLocales } from 'locales';

import MainCard from 'components/MainCard';
import StagesRealTimeChart from './StagesRealTimeChart';
import StageHistoryArea from './StageHistoryArea';
import StageRealTimeArea from './StageRealTimeArea';

function LayoutPage() {
  const { translate } = useLocales();

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [splitScreen, setSplitScreen] = React.useState(false);

  const imgRef = React.useRef();

  const drawOpen = useSelector((state) => {
    return state.menu.drawerOpen;
  }, shallowEqual);

  const handleResize = () => {
    // console.log('resize');
    if (imgRef.current) {
      setWidth(imgRef.current.width);
      setHeight(imgRef.current.height);
    }
  };

  const handleLoad = () => {
    // console.log('load: ', time);
    if (imgRef.current) {
      setTimeout(() => {
        setWidth(imgRef.current.width);
        setHeight(imgRef.current.height);
      }, 250);
    }
  };

  React.useEffect(() => {
    // console.log('Thay đổi state');
    handleLoad();
    // const imgRefCurrent = imgRef.current;
    // Khởi tạo kích thước ban đầu khi hình ảnh tải xong
    // imgRefCurrent.addEventListener('load', handleLoad);

    // Bắt sự kiện resize để theo dõi sự thay đổi kích thước cửa sổ
    window.addEventListener('resize', handleResize);

    return () => {
      // Gỡ bỏ bất kỳ sự kiện lắng nghe nào khi component unmount
      // imgRefCurrent.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawOpen, splitScreen]);

  const handleButtonClick = () => {
    setSplitScreen(!splitScreen);
    // handleLoad();
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h2" color="primary" sx={{ marginBottom: '16px' }}>
          {translate('LAYOUT DIAGRAM OF VDM MACHINING TOOLS MANUFACTURING SECTION')}
        </Typography>
        <Button variant="outlined" color="primary" onClick={handleButtonClick} sx={{ position: 'absolute', right: 30 }}>
          {splitScreen ? translate('Đóng biểu đồ phân tích') : translate('Mở biểu đồ phân tích')}
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        md={splitScreen ? 8 : 12}
        lg={splitScreen ? 8 : 12}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ position: 'relative' }}>
          <img
            ref={imgRef}
            src={layoutImg}
            alt="So do layout phong co khi"
            style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
          />
          <SignalLightsLayout width={width} height={height} />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Typography
            variant="body1"
            component="div"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginRight: '24px' }}
          >
            <div style={{ marginRight: '10px' }}>
              <SignalLight color="off" />
            </div>
            : {translate('Turn off machine')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginRight: '24px' }}
          >
            <div style={{ marginRight: '10px' }}>
              <SignalLight color="yellow" />
            </div>
            : {translate('Running without load')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginRight: '24px' }}
          >
            <div style={{ marginRight: '10px' }}>
              <SignalLight color="green" />
            </div>
            : {translate('Running with load')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginRight: '24px' }}
          >
            <div style={{ marginRight: '10px' }}>
              <SignalLight color="red" />
            </div>
            : {translate('Error')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginRight: '24px' }}
          >
            <div style={{ marginRight: '10px' }}>
              <SignalLight custom="standing" color="purple" size="28" />
            </div>
            : {translate('You are here')}
          </Typography>
        </Box>
      </Grid>
      {splitScreen && (
        <Grid item xs={12} md={4} lg={4} sx={{ maxHeight: 900, overflow: 'auto' }}>
          <MainCard content={true} sx={{ mt: 1.5 }}>
            <StagesRealTimeChart />
          </MainCard>
          <Divider sx={{ my: 2 }} />
          <StageRealTimeArea />
          <Divider sx={{ my: 2 }} />
          <StageHistoryArea />
        </Grid>
      )}
    </Grid>
  );
}

export default LayoutPage;
