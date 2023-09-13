// project import
import ROSLIB from 'roslib';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

import RosPropsContext from 'context/RosPropsContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
var ros = new ROSLIB.Ros({});

function App() {
  const rosProps = {
    ros,
    connect: () => {
      ros.connect('ws://localhost:9090');
    },
  };

  return (
    <RosPropsContext.Provider value={rosProps}>
      <ThemeCustomization>
        <ScrollTop>
          <Routes />
        </ScrollTop>
      </ThemeCustomization>
    </RosPropsContext.Provider>
  );
}

export default App;
