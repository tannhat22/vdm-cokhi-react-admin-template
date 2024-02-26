import PropTypes from 'prop-types';
import ROSLIB from 'roslib';
import {
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
  FormControl,
  Select,
  TextField,
  Tooltip,
  InputAdornment,
  InputLabel,
  Modal,
  MenuItem,
  Typography,
  LinearProgress,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState, useContext, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  padding: 0,
};

const AddMachineForm = ({ update }) => {
  const { translate } = useLocales();

  const [openAdd, setOpenAdd] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [successServ, setSuccessServ] = useState(true);
  const [status, setStatus] = useState('');
  const [values, setValues] = useState({
    pass: '',
    name: '',
    type: '',
    plc: '',
    address: 0,
    showPass: false,
  });

  // console.log(values);

  const ros = useContext(RosPropsContext);

  var resetMachineClient = new ROSLIB.Service({
    ros: ros,
    name: '/create_machine',
    serviceType: 'vdm_cokhi_machine_msgs/CreateMachine',
  });

  function CreateServiceCall(password, name, type, plc, address) {
    setIsLoad(true);
    let requestReset = new ROSLIB.ServiceRequest({
      password,
      name,
      type,
      plc_model: plc,
      plc_address: address,
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
    CreateServiceCall(values.pass, values.name.trim(), values.type.trim(), values.plc, parseInt(values.address));
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
          {translate('Add new machine')}
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
                  <Typography sx={{ color: 'green' }}>{translate('Add new machine')}</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    name="name"
                    type="text"
                    fullWidth
                    label={translate('Machine name')}
                    placeholder={translate('Machine name')}
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
                    label={translate('Machine type')}
                    placeholder={translate('Machine type')}
                    variant="outlined"
                    required
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item sx={{ display: 'flex' }}>
                  <FormControl sx={{ width: '50%', marginRight: '10px' }} required>
                    <InputLabel id="plc-select-label">PLC Model</InputLabel>
                    <Select
                      name="plc"
                      labelId="plc-select-label"
                      id="plc-select"
                      value={values.plc}
                      label="PLC Model"
                      onChange={handleChange}
                    >
                      <MenuItem value="FX3U">FX3U</MenuItem>
                      <MenuItem value="KV-5500">KV-5500</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    name="address"
                    type="number"
                    fullWidth
                    label={translate('PLC Address')}
                    placeholder={translate('PLC Address')}
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
                    {translate('Add machine')}
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
