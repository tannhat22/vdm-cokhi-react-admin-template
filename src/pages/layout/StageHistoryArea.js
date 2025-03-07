import { useState, useContext, useEffect, useMemo } from 'react';
import ROSLIB from 'roslib';
import moment from 'moment';

// material-ui
import { Grid, Stack, FormControlLabel, FormGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project import
import { MaterialUISwitch } from 'components/CustomizedSwitches';

import RosPropsContext from 'context/RosPropsContext';
import { useLocales } from 'locales';

import MainCard from 'components/MainCard';
import ColumnChart from './ColumnChart';

const getTargetValue = (stage) => {
  return Number(process.env[`REACT_APP_TARGET_${stage}`]);
};

const stagesOrdinal = process.env.REACT_APP_STAGES_ORDINAL;

// ==============================|| DASHBOARD - DEFAULT ||============================== //
const StageHistoryArea = () => {
  const { translate } = useLocales();

  const today = useMemo(() => new Date(), []);
  const sevenDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date;
  }, []);
  const specifiedMinDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 12);
    return date;
  }, []);

  const [stagesData, setStagesData] = useState([
    // {
    //   stageName: 'GS',
    //   target: 65,
    //   data: [
    //     { date: '03/03/2025', underload: 600, noload: 60, offtime: 60 },
    //     { date: '04/03/2025', underload: 600, noload: 60, offtime: 60 },
    //   ],
    // },
    // {
    //   stageName: 'BJ',
    //   target: 65,
    //   data: [
    //     { date: '03/03/2025', underload: 600, noload: 60, offtime: 60 },
    //     { date: '04/03/2025', underload: 600, noload: 60, offtime: 60 },
    //   ],
    // },
    // {
    //   stageName: 'LN',
    //   target: 65,
    //   data: [
    //     { date: '03/03/2025', underload: 600, noload: 60, offtime: 60 },
    //     { date: '04/03/2025', underload: 600, noload: 60, offtime: 60 },
    //   ],
    // },
  ]);
  const [shift, setShift] = useState('CN');
  const [selectedBeginDate, setSelectedBeginDate] = useState(sevenDaysAgo);
  const [selectedEndDate, setSelectedEndDate] = useState(today);

  const ros = useContext(RosPropsContext);

  useEffect(() => {
    var getStagesDataClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_all_stage_data',
      serviceType: 'vdm_machine_msgs/GetAllStageData',
    });

    let requestStagesData = new ROSLIB.ServiceRequest({
      min_date: moment(selectedBeginDate).format('DD/MM/YYYY'),
      max_date: moment(selectedEndDate).format('DD/MM/YYYY'),
      shift: '',
    });

    getStagesDataClient.callService(requestStagesData, function (result) {
      if (result.success) {
        result.all_stage_data.sort((a, b) => {
          return stagesOrdinal.indexOf(a.machine_name) - stagesOrdinal.indexOf(b.machine_name);
        });

        let stagesData = [];
        result.all_stage_data.forEach((stage) => {
          stagesData.push({
            stageName: stage.machine_name,
            target: getTargetValue(stage.machine_name),
            data: stage.machine_data,
          });
        });
        setStagesData(stagesData);
      }
    });
  }, [selectedBeginDate, selectedEndDate]);

  const handleShiftChange = (event) => {
    event.target.checked ? setShift('CD') : setShift('CN');
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      {/* row 2 */}
      <Grid item xs={12} md={12} lg={12}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <DatePicker
              label={translate('Begin date')}
              value={selectedBeginDate}
              onChange={(date) => {
                setSelectedBeginDate(date);
              }}
              format="dd/MM/yyyy"
              minDate={specifiedMinDate}
              maxDate={today}
            />
            <DatePicker
              label={translate('End date')}
              value={selectedEndDate}
              onChange={(date) => {
                setSelectedEndDate(date);
              }}
              format="dd/MM/yyyy"
              minDate={specifiedMinDate}
              maxDate={today}
            />
            <FormGroup>
              <FormControlLabel
                control={<MaterialUISwitch defaultChecked={false} onChange={handleShiftChange} shift={shift} />}
              />
            </FormGroup>
          </Stack>
          {stagesData.map((stage, index) => {
            return (
              <MainCard key={index} content={true} sx={{ mt: 1.5 }}>
                <ColumnChart stage={stage} shift={shift} />
              </MainCard>
            );
          })}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default StageHistoryArea;
