import { useEffect, Fragment } from 'react';
// import ROSLIB from 'roslib';
import { Grid } from '@mui/material';

import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
// import RosPropsContext from 'context/RosPropsContext';

function InformArea() {
  //   const ros = useContext(RosPropsContext);
  useEffect(() => {}, []);

  return (
    <Fragment>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="No-load operating time" desc="12 h : 40 m" time="Time: 25/9/2023 17:55" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Under load operating time" desc="12 h : 40 m" time="Time: 25/9/2023 17:55" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="GT" desc="Min: 1 - Max: 10 - Current: 5" time="Time: 25/9/2023 17:55" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Time to reach speed" desc="30 ms" time="Time: 25-9-2023 17:55" />
      </Grid>
    </Fragment>
  );
}

export default InformArea;
