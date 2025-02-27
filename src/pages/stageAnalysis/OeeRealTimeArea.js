import PropTypes from 'prop-types';
import { useState, useEffect, useContext, Fragment } from 'react';
import ROSLIB from 'roslib';
import { Grid, Box } from '@mui/material';

import RosPropsContext from 'context/RosPropsContext';
// import { useLocales } from 'locales';
import MainCard from 'components/MainCard';
import ColumnChart from './ColumnChart';
import RadialBarChart from './RadialBarChart';
import PieChart from './PieChart';

function OeeRealTimeArea({ stage }) {
  // const { translate } = useLocales();
  const [stageData, setStageData] = useState({
    machines: [], // 'GS01', 'GS02', 'GS03', 'GS04', 'GS05', 'GS06'
    signals: [],
    availabilities: [], // 91, 84, 72, 91, 84, 72
    performances: [], // 69, 83, 92, 91, 84, 72
    qualities: [], // 100, 100, 100, 91, 84, 72
    average: [], // 83, 85, 90
    underload: 0,
    noload: 0,
    overload: 0,
    offtime: 0,
  });

  const ros = useContext(RosPropsContext);
  // console.log('re-render');

  useEffect(() => {
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: '/state_machines',
      messageType: 'vdm_machine_msgs/MachinesStateStamped',
    });

    let subscription_callback = function (message) {
      handleDataWebsocket(message);
    };

    listener.subscribe(subscription_callback);

    function handleDataWebsocket(data) {
      if (stage === '') return;

      const stageObj = {
        machines: [],
        signals: [],
        availabilities: [],
        performances: [],
        qualities: [],
        average: [],
        underload: 0,
        noload: 0,
        overload: 0,
        offtime: 0,
      };
      let availabilitySum = 0;
      let performanceSum = 0;
      let qualitySum = 0;

      data.state_machines.forEach((machine) => {
        if (machine.type === stage) {
          switch (machine.signal_light) {
            case 1:
              stageObj.signals.push('rgb(0, 227, 150)');
              stageObj.underload += 1;
              break;
            case 2:
              stageObj.signals.push('rgba(252,185,0,1)');
              stageObj.noload += 1;
              break;
            case 3:
              stageObj.signals.push('rgb(233, 13, 32)');
              stageObj.overload += 1;
              break;
            default:
              stageObj.signals.push('rgb(199, 199, 200)');
              stageObj.offtime += 1;
          }
          stageObj.machines.push(machine.name);
          stageObj.availabilities.push(machine.availability);
          stageObj.performances.push(machine.performance);
          stageObj.qualities.push(machine.quality);

          availabilitySum += machine.availability;
          performanceSum += machine.performance;
          qualitySum += machine.quality;
        }
      });
      stageObj.average = [
        Math.round(availabilitySum / stageObj.availabilities.length),
        Math.round(performanceSum / stageObj.performances.length),
        Math.round(qualitySum / stageObj.qualities.length),
      ];
      setStageData(stageObj);
    }

    return () => {
      listener.unsubscribe();
    };
  }, [stage]);

  return (
    <Fragment>
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <RadialBarChart
              chartName={`OEE TỔNG THỂ CÔNG ĐOẠN ${stage}`}
              categories={['Khả dụng', 'Hiệu suất', 'Chất lượng']}
              series={stageData.average}
            />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <PieChart
              chartName={`DỮ LIỆU TỔNG QUAN CÔNG ĐOẠN ${stage}`}
              categories={['Tắt máy', 'Chạy không tải', 'Chạy có tải', 'Quá tải']}
              series={[stageData.offtime, stageData.noload, stageData.underload, stageData.overload]}
              colors={['rgb(199, 199, 200)', 'rgba(252,185,0,1)', 'rgb(0, 227, 150)', 'rgb(233, 13, 32)']}
            />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <ColumnChart
              chartName="Tính Khả Dụng"
              target={95}
              categories={stageData.machines}
              series={[{ name: 'Phần trăm', data: stageData.availabilities }]}
              colors={stageData.signals}
            />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <ColumnChart
              chartName="Tính Hiệu Suất"
              target={95}
              categories={stageData.machines}
              series={[{ name: 'Phần trăm', data: stageData.performances }]}
              colors={stageData.signals}
            />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <MainCard content={false}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <ColumnChart
              chartName="Tính Chất Lượng"
              target={95}
              categories={stageData.machines}
              series={[{ name: 'Phần trăm', data: stageData.qualities }]}
              colors={stageData.signals}
            />
          </Box>
        </MainCard>
      </Grid>
    </Fragment>
  );
}

OeeRealTimeArea.propTypes = {
  stage: PropTypes.string.isRequired,
};

export default OeeRealTimeArea;
