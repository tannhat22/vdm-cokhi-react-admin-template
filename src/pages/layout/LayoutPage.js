import React from 'react';
import { useSelector } from 'react-redux';

import layoutImg from 'assets/images/layout/layout-ck-vdm-2023.jpg';
import { Box, Typography } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye } from '@fortawesome/free-solid-svg-icons';
// import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import SignalLightsLayout from './SignalLightsLayout';

function LayoutPage() {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  const imgRef = React.useRef();

  useSelector((state) => {
    console.log('drawChange');
    console.log(state);
  });

  const handleResize = () => {
    console.log('resize');
    if (imgRef.current) {
      setWidth(imgRef.current.width);
      setHeight(imgRef.current.height);
    }
  };

  const handleLoad = () => {
    if (imgRef.current) {
      setTimeout(() => {
        setWidth(imgRef.current.width);
        setHeight(imgRef.current.height);
      }, 200);
    }
  };

  React.useEffect(() => {
    const imgRefCurrent = imgRef.current;
    // Khởi tạo kích thước ban đầu khi hình ảnh tải xong
    imgRefCurrent.addEventListener('load', handleLoad);

    // Bắt sự kiện resize để theo dõi sự thay đổi kích thước cửa sổ
    window.addEventListener('resize', handleResize);

    return () => {
      // Gỡ bỏ bất kỳ sự kiện lắng nghe nào khi component unmount
      imgRefCurrent.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h1" color="primary" sx={{ marginBottom: '16px' }}>
          Sơ đồ layout phòng cơ khí VDM
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
      <p>Width: {width}</p>
      <p>Heigt: {height}</p>
    </Box>
  );
}

export default LayoutPage;
