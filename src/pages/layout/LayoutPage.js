import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import layoutImg from 'assets/images/layout/layout-ck-vdm-new.jpg';
import { Box, Typography } from '@mui/material';

import SignalLightsLayout from './SignalLightsLayout';
import SignalLight from 'components/SignalLight';
import { useLocales } from 'locales';

function LayoutPage() {
  const { translate } = useLocales();

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

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
  }, [drawOpen]);

  return (
    <Box>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h2" color="primary" sx={{ marginBottom: '16px' }}>
          {translate('VDM MECHANICAL DEPARTMENT LAYOUT DIAGRAM')}
        </Typography>
      </div>
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
          : {translate('Shutdown')}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginRight: '24px' }}
        >
          <div style={{ marginRight: '10px' }}>
            <SignalLight color="yellow" />
          </div>
          : {translate('No-load')}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginRight: '24px' }}
        >
          <div style={{ marginRight: '10px' }}>
            <SignalLight color="green" />
          </div>
          : {translate('Underload')}
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
          : {translate('Current Position')}
        </Typography>
      </div>
    </Box>
  );
}

export default LayoutPage;
