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
import { useState, useContext, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import RosPropsContext from 'context/RosPropsContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  padding: 0,
};

const AddMachineForm = ({ update }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [successServ, setSuccessServ] = useState(true);
  const [status, setStatus] = useState('');
  const [values, setValues] = useState({
    pass: '',
    name: '',
    type: '',
    showPass: false,
  });

  // console.log(values);

  const ros = useContext(RosPropsContext);

  var resetMachineClient = new ROSLIB.Service({
    ros: ros,
    name: '/create_machine',
    serviceType: 'vdm_cokhi_machine_msgs/CreateMachine',
  });

  function CreateServiceCall(password, name, type) {
    setIsLoad(true);
    let requestReset = new ROSLIB.ServiceRequest({
      password,
      name,
      type,
    });

    resetMachineClient.callService(requestReset, function (result) {
      // console.log(result);
      setIsLoad(false);
      setSuccessServ(result.success);

      if (result.success) {
        setOpenAdd(false);
        update();
      } else {
        setStatus(result.status);
      }
    });
  }

  const handleOpen = () => {
    setSuccessServ(true);
    setOpenAdd(true);
  };
  const handleClose = () => {
    if (isLoad) return;
    setOpenAdd(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);
    CreateServiceCall(values.pass, values.name.trim(), values.type.trim());
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
      <Tooltip title="Edit" arrow>
        <Button
          onClick={handleOpen}
          // color={slot === '7 days' ? 'primary' : 'secondary'}
          size="medium"
          variant="contained"
          sx={{ width: '20%', display: 'flex', alignItems: 'center' }}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
        >
          Thêm máy mới
        </Button>
      </Tooltip>
      <Modal
        open={openAdd}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Paper elelvation={2} sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography sx={{ color: 'green' }}>Thêm máy mới</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    name="name"
                    type="text"
                    fullWidth
                    label="Tên máy"
                    placeholder="Tên máy"
                    variant="outlined"
                    required
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    name="type"
                    type="text"
                    fullWidth
                    label="Loại máy"
                    placeholder="Loại máy"
                    variant="outlined"
                    required
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    error={!successServ}
                    name="pass"
                    type={values.showPass ? 'text' : 'password'}
                    fullWidth
                    label="Mật Khẩu"
                    placeholder="Mật Khẩu"
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
                    Thêm máy
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

AddMachineForm.propTypes = {
  update: PropTypes.func,
};

export default AddMachineForm;
