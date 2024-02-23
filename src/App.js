// project import
import ROSLIB from 'roslib';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import RosPropsContext from 'context/RosPropsContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
var ros = new ROSLIB.Ros({
  url: 'ws://192.168.1.2:9090',
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <RosPropsContext.Provider value={ros}>
        <ThemeCustomization>
          <ScrollTop>
            <Routes />
          </ScrollTop>
        </ThemeCustomization>
      </RosPropsContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
