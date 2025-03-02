import PropTypes from 'prop-types';
import ROSLIB from 'roslib';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Modal,
  Typography,
  LinearProgress,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState, useContext } from 'react';

import RosPropsContext from 'context/RosPropsContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  padding: 0,
};

const ResetForm = ({ id, machineName, plcModel, plcAddress }) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [successServ, setSuccessServ] = useState(true);
  const [status, setStatus] = useState('');
  const [values, setValues] = useState({
    pass: '',
    showPass: false,
  });

  const ros = useContext(RosPropsContext);

  var resetMachineClient = new ROSLIB.Service({
    ros: ros,
    name: `/reset_machine_${plcModel}`,
    serviceType: 'vdm_machine_msgs/ResetMachinePLC',
  });

  function ResetServiceCall(password) {
    setIsLoad(true);
    let requestReset = new ROSLIB.ServiceRequest({
      id_machine: id,
      name: machineName,
      plc_address: plcAddress,
      password,
    });

    resetMachineClient.callService(requestReset, function (result) {
      setIsLoad(false);
      setSuccessServ(result.success);

      if (result.success) {
        setOpenLogin(false);
      } else {
        setStatus(result.status);
      }
    });
  }

  const handleOpen = () => {
    setSuccessServ(true);
    setOpenLogin(true);
  };
  const handleClose = () => {
    if (isLoad) return;
    setOpenLogin(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);
    ResetServiceCall(values.pass);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordHide = () => {
    setValues({
      ...values,
      showPass: !values.showPass,
    });
  };

  // const email = useSelector((state) => state.login.email);

  return (
    <>
      <Button
        onClick={handleOpen}
        // color={slot === '7 days' ? 'primary' : 'secondary'}
        size="large"
        variant="contained"
        sx={{ width: '100%', height: '100%' }}
      >
        Reset
      </Button>
      <Modal
        open={openLogin}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Paper elelvation={2} sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography>
                    <span style={{ color: 'red' }}>Reset machine:</span> {`${machineName}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    error={!successServ}
                    name="pass"
                    type={values.showPass ? 'text' : 'password'}
                    fullWidth
                    label="Password"
                    placeholder="Password"
                    variant="outlined"
                    required
                    helperText={status}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            // onClick={handlePassVisibilty}
                            aria-label="toggle password"
                            edge="end"
                            onClick={togglePasswordHide}
                          >
                            {values.showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item>
                  <Button disabled={isLoad} type="submit" fullWidth variant="contained">
                    Reset
                  </Button>
                </Grid>

                {isLoad ? (
                  <Grid item>
                    <LinearProgress />
                  </Grid>
                ) : null}
              </Grid>
            </form>
          </Paper>
        </Box>
      </Modal>
    </>
  );
};

ResetForm.propTypes = {
  id: PropTypes.number,
  machineName: PropTypes.string,
  plcModel: PropTypes.string,
  plcAddress: PropTypes.number,
};

export default ResetForm;
