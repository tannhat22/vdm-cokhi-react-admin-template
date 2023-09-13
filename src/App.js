// project import
import ROSLIB from 'roslib';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

import RosPropsContext from 'context/RosPropsContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
var ros = new ROSLIB.Ros({});
ros.connect('ws://localhost:9090');

function App() {
  return (
    <RosPropsContext.Provider value={ros}>
      <ThemeCustomization>
        <ScrollTop>
          <Routes />
        </ScrollTop>
      </ThemeCustomization>
    </RosPropsContext.Provider>
  );
}

export default App;
