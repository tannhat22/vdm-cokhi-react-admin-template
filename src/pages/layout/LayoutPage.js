import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import layoutImg from 'assets/images/layout/layout-ck-vdm-new.jpg';
import { Box, Button, Typography } from '@mui/material';

import SignalLightsLayout from './SignalLightsLayout';
import SignalLight from 'components/SignalLight';
import { useLocales } from 'locales';

import MainCard from 'components/MainCard';
import StageRealTimeChart from './StageRealTimeChart';

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
    <Box>
      <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h2" color="primary" sx={{ marginBottom: '16px' }}>
          {translate('LAYOUT DIAGRAM OF VDM MACHINING TOOLS MANUFACTURING SECTION')}
        </Typography>
        <Button variant="outlined" color="primary" onClick={handleButtonClick} sx={{ position: 'absolute', right: 30 }}>
          {splitScreen ? translate('Đóng biểu đồ phân tích') : translate('Mở biểu đồ phân tích')}
        </Button>
      </Box>
      <Box style={{ display: 'flex', flexDirection: splitScreen ? 'row' : 'column' }}>
        <Box style={{ flex: splitScreen ? 6 : 1 }}>
          <div style={{ position: 'relative' }}>
            <img
              ref={imgRef}
              src={layoutImg}
              alt="So do layout phong co khi"
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />

            <SignalLightsLayout width={width} height={height} />
          </div>
          <div style={{ display: 'flex' }}>
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
              : {translate('Overload')}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginRight: '24px' }}
            >
              <div style={{ marginRight: '10px' }}>
                <SignalLight custom="standing" color="purple" size="28" />
              </div>
              : {translate('Stand position')}
            </Typography>
          </div>
        </Box>
        {splitScreen && (
          <Box style={{ flex: 4, marginLeft: '16px', padding: '16px', borderLeft: '2px solid #ccc' }}>
            {/* <Typography variant="h4" sx={{ color: 'black' }}>
              {translate('Biểu đồ phân tích công đoạn')}
            </Typography> */}
            <MainCard content={true} sx={{ mt: 1.5 }}>
              <StageRealTimeChart />
            </MainCard>
            <MainCard content={true} sx={{ mt: 1.5 }}>
              <StageRealTimeChart />
            </MainCard>
            <MainCard content={true} sx={{ mt: 1.5 }}>
              <StageRealTimeChart />
            </MainCard>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default LayoutPage;
