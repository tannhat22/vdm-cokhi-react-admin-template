import React from 'react';

import layoutImg from 'assets/images/layout/layout-ck-vdm-2023.jpg';
import { Box } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye } from '@fortawesome/free-solid-svg-icons';
// import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import SignalLight from 'components/SignalLight';

function LayoutPage() {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  const imgRef = React.useRef();

  const handleResize = () => {
    console.log('resize');
    if (imgRef.current) {
      setWidth(imgRef.current.width);
      setHeight(imgRef.current.height);
    }
  };

  const handleLoad = () => {
    console.log('load');
    if (imgRef.current) {
      setTimeout(() => {
        console.log('nhat');
        setWidth(imgRef.current.width);
        setHeight(imgRef.current.height);
      }, 200);
      // setWidth(imgRef.current.width);
      // setHeight(imgRef.current.height);
    }
  };

  React.useEffect(() => {
    const imgRefCurrent = imgRef.current;
    // Khởi tạo kích thước ban đầu khi hình ảnh tải xong
    imgRefCurrent.addEventListener('load', handleLoad);

    // Bắt sự kiện resize để theo dõi sự thay đổi kích thước cửa sổ
    window.addEventListener('resize', handleResize);

    // const myTimeout = setTimeout(() => {
    //   console.log(imgRefCurrent.width);
    //   console.log(imgRefCurrent.height);
    //   setWidth(imgRefCurrent.width);
    //   setHeight(imgRefCurrent.height);
    // }, 300);

    return () => {
      // Gỡ bỏ bất kỳ sự kiện lắng nghe nào khi component unmount
      imgRefCurrent.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      // clearTimeout(myTimeout);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        // width: '100%',
      }}
    >
      <img
        ref={imgRef}
        src={layoutImg}
        alt="So do layout phong co khi"
        style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
      />
      <div style={{ position: 'absolute', left: `${(width * 24) / 100}px`, top: `${(height * 3.2) / 100}px` }}>
        <SignalLight color="off" size={`${(width * 2) / 100}`} custom="layout" />
      </div>
      <div style={{ position: 'absolute', left: `${(width * 29.76) / 100}px`, top: `${(height * 3.2) / 100}px` }}>
        <SignalLight color="off" size={`${(width * 2) / 100}`} custom="layout" />
      </div>
      <div style={{ position: 'absolute', left: `${(width * 35.55) / 100}px`, top: `${(height * 3.2) / 100}px` }}>
        <SignalLight color="off" size={`${(width * 2) / 100}`} custom="layout" />
      </div>
      <p>Chiều rộng: {width}</p>
      <p>Chiều cao: {height}</p>
    </Box>
  );
}

export default LayoutPage;
