// il8n
import 'locales/i18n';

// project import
import ROSLIB from 'roslib';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ThemeLocalization from 'locales';
import ScrollTop from 'components/ScrollTop';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import RosPropsContext from 'context/RosPropsContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
var ros = new ROSLIB.Ros({
  // url: 'ws://localhost:9090',
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <RosPropsContext.Provider value={ros}>
        <ThemeCustomization>
          <ThemeLocalization>
            <ScrollTop>
              <Routes />
            </ScrollTop>
          </ThemeLocalization>
        </ThemeCustomization>
      </RosPropsContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
