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
  MenuItem,
  Modal,
  Typography,
  LinearProgress,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState, useContext, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

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

const EditMachineForm = ({ id, machineName, machineType, plc, address, update }) => {
  const { translate } = useLocales();

  const [openEdit, setOpenEdit] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [successServ, setSuccessServ] = useState(true);
  const [status, setStatus] = useState('');
  const [values, setValues] = useState({
    pass: '',
    newName: machineName,
    newType: machineType,
    newPLC: plc,
    newAddress: address,
    showPass: false,
  });

  // console.log(values);

  const ros = useContext(RosPropsContext);

  const PLCs_env = JSON.parse(process.env.REACT_APP_PLC_MODEL);

  var resetMachineClient = new ROSLIB.Service({
    ros: ros,
    name: '/update_machine',
    serviceType: 'vdm_machine_msgs/UpdateMachine',
  });

  function UpdateServiceCall(password, new_name, new_type, newPLC, newAddress) {
    setIsLoad(true);
    let requestReset = new ROSLIB.ServiceRequest({
      password,
      id_machine: id,
      new_name,
      new_type,
      new_plc_model: newPLC,
      new_plc_address: newAddress,
    });

    resetMachineClient.callService(requestReset, function (result) {
      // console.log(result);
      setIsLoad(false);
      setSuccessServ(result.success);

      if (result.success) {
        setOpenEdit(false);
        update();
      } else {
        setStatus(result.status);
      }
    });
  }

  const handleOpen = () => {
    setSuccessServ(true);
    setOpenEdit(true);
  };
  const handleClose = () => {
    if (isLoad) return;
    setOpenEdit(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);
    UpdateServiceCall(
      values.pass,
      values.newName.trim(),
      values.newType.trim(),
      values.newPLC,
      parseInt(values.newAddress),
    );
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
        <IconButton aria-label="edit" sx={{ fontSize: '1.1rem', '&:hover': { color: 'green' } }} onClick={handleOpen}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </IconButton>
      </Tooltip>
      <Modal
        open={openEdit}
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
                    <span style={{ color: 'green' }}>Edit machine:</span> {`${machineName}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    name="newName"
                    value={values.newName}
                    type="text"
                    fullWidth
                    label={translate('Machine name')}
                    placeholder={translate('New Machine name')}
                    variant="outlined"
                    required
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    name="newType"
                    value={values.newType}
                    type="text"
                    fullWidth
                    label={translate('Machine type')}
                    placeholder={translate('New Machine type')}
                    variant="outlined"
                    required
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item sx={{ display: 'flex' }}>
                  <FormControl sx={{ width: '50%', marginRight: '10px' }} required>
                    <InputLabel id="plc-select-2-label">PLC model</InputLabel>
                    <Select
                      name="newPLC"
                      labelId="plc-select-2-label"
                      id="plc-select-2"
                      value={values.newPLC}
                      label="PLC model"
                      onChange={handleChange}
                    >
                      {PLCs_env.map((plc, i) => (
                        <MenuItem key={i} value={plc}>
                          {plc}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    name="newAddress"
                    value={values.newAddress}
                    type="number"
                    fullWidth
                    label={translate('PLC Address')}
                    placeholder={translate('New PLC Address')}
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
                  {/* <Button type="submit" fullWidth variant="contained"> */}
                  <Button disabled={isLoad} type="submit" fullWidth variant="contained">
                    {translate('Update machine')}
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

EditMachineForm.propTypes = {
  id: PropTypes.number,
  machineName: PropTypes.string,
  machineType: PropTypes.string,
  plc: PropTypes.string,
  address: PropTypes.number,
  update: PropTypes.func,
};

export default EditMachineForm;
