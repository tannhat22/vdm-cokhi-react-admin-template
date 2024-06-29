import PropTypes from 'prop-types';
import ROSLIB from 'roslib';
import {
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
  TextField,
  Tooltip,
  InputAdornment,
  Modal,
  Typography,
  LinearProgress,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import RosPropsContext from 'context/RosPropsContext';
import { Fragment } from 'react';
import { useLocales } from 'locales';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  padding: 0,
};

const DeleteMachineForm = ({ id, machineName, update }) => {
  const { translate } = useLocales();

  const [openDelete, setOpenDelete] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [successServ, setSuccessServ] = useState(true);
  const [status, setStatus] = useState('');
  const [values, setValues] = useState({
    pass: '',
    showPass: false,
  });

  // console.log('re-render');

  const ros = useContext(RosPropsContext);

  var resetMachineClient = new ROSLIB.Service({
    ros: ros,
    name: '/delete_machine',
    serviceType: 'vdm_machine_msgs/DeleteMachine',
  });

  function UpdateServiceCall(password) {
    setIsLoad(true);
    let requestReset = new ROSLIB.ServiceRequest({
      password,
      id_machine: id,
    });

    resetMachineClient.callService(requestReset, function (result) {
      // console.log(result);
      setIsLoad(false);
      setSuccessServ(result.success);

      if (result.success) {
        setOpenDelete(false);
        update();
      } else {
        setStatus(result.status);
      }
    });
  }

  const handleOpen = () => {
    setSuccessServ(true);
    setOpenDelete(true);
  };
  const handleClose = () => {
    if (isLoad) return;
    setOpenDelete(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);
    UpdateServiceCall(values.pass, values.newName);
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
    <Fragment>
      <Tooltip title="Delete" arrow>
        <IconButton aria-label="delete" sx={{ fontSize: '1.1rem', '&:hover': { color: 'red' } }} onClick={handleOpen}>
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      </Tooltip>
      <Modal
        open={openDelete}
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
                    <span style={{ color: 'red' }}>{translate('Delete machine')}:</span> {`${machineName}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    error={!successServ}
                    name="pass"
                    type={values.showPass ? 'text' : 'password'}
                    fullWidth
                    label={translate('Password')}
                    placeholder={translate('Password')}
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
                    {translate('Delete confirmation')}
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
    </Fragment>
  );
};

DeleteMachineForm.propTypes = {
  id: PropTypes.number,
  machineName: PropTypes.string,
  update: PropTypes.func,
};

export default DeleteMachineForm;
