import PropTypes from 'prop-types';

// material-ui
import { Grid, Stack, Typography, Box } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
// import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticEcommerce = ({ title, desc, time }) => (
  <MainCard contentSX={{ p: 2.25 }}>
    <Stack spacing={0.5}>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h4" color="inherit">
            {desc}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
    <Box sx={{ pt: 2.25 }}>
      <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'right' }}>
        {time}
      </Typography>
    </Box>
  </MainCard>
);

AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  time: PropTypes.string,
};

AnalyticEcommerce.defaultProps = {
  color: 'primary',
};

export default AnalyticEcommerce;
