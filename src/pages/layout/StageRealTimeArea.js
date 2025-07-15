import { useState, useContext, useEffect } from 'react';
import ROSLIB from 'roslib';

// material-ui
import { Stack } from '@mui/material';

// project import

import RosPropsContext from 'context/RosPropsContext';
// import { useLocales } from 'locales';

import MainCard from 'components/MainCard';
import AreaChart from './AreaChart';

const getTargetValue = (stage) => {
  return Number(process.env[`REACT_APP_TARGET_${stage}`]);
};

const minutesInShift = Number(process.env.REACT_APP_MINUTES_IN_SHIFT);
const stagesOrdinal = JSON.parse(process.env.REACT_APP_STAGES_ORDINAL);

// ==============================|| DASHBOARD - DEFAULT ||============================== //
const StageRealTimeArea = () => {
  // const { translate } = useLocales();

  const [stagesData, setStagesData] = useState({
    // GS: {
    //   target: 60,
    //   times: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40'],
    //   underloads: [20, 25, 30, 35, 40, 45, 50, 55, 60],
    //   noloads: [10, 20, 25, 25, 30, 30, 35, 40, 45],
    //   offtimes: [10, 10, 10, 15, 15, 15, 20, 20, 20],
    // },
    // BJ: {
    //   target: 35,
    //   times: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40'],
    //   underloads: [20, 25, 30, 35, 40, 45, 50, 55, 60],
    //   noloads: [10, 20, 25, 25, 30, 30, 35, 40, 45],
    //   offtimes: [10, 10, 10, 15, 15, 15, 20, 20, 20],
    // },
    // LN: {
    //   target: 25,
    //   times: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40'],
    //   underloads: [20, 25, 30, 35, 40, 45, 50, 55, 60],
    //   noloads: [10, 20, 25, 25, 30, 30, 35, 40, 45],
    //   offtimes: [10, 10, 10, 15, 15, 15, 20, 20, 20],
    // },
  });

  const ros = useContext(RosPropsContext);

  useEffect(() => {
    const fetchStagesLogs = () => {
      var getStagesLogsClient = new ROSLIB.Service({
        ros: ros,
        name: '/get_stages_logs',
        serviceType: 'vdm_machine_msgs/GetStagesLogs',
      });

      let requestStagesLogs = new ROSLIB.ServiceRequest({});

      getStagesLogsClient.callService(requestStagesLogs, function (result) {
        if (result.success) {
          const stagesLogs = JSON.parse(result.json_msg);

          // Lấy mảng thời gian (key của stagesLogs)
          const times = Object.keys(stagesLogs);

          // Gom dữ liệu cho từng công đoạn
          let stagesLogsFilter = {};
          times.forEach((time) => {
            Object.entries(stagesLogs[time]).forEach(([stageName, data]) => {
              if (!stagesLogsFilter[stageName]) {
                stagesLogsFilter[stageName] = {
                  target: getTargetValue(stageName),
                  times: [],
                  underloads: [],
                  noloads: [],
                  offtimes: [],
                };
              }

              const sumMinute = minutesInShift * data[0];
              stagesLogsFilter[stageName].times.push(time.substring(11, 16));
              stagesLogsFilter[stageName].noloads.push(Math.round((data[1] * 100) / sumMinute));
              stagesLogsFilter[stageName].underloads.push(Math.round((data[2] * 100) / sumMinute));
              stagesLogsFilter[stageName].offtimes.push(Math.round((data[3] * 100) / sumMinute));
            });
          });

          setStagesData(stagesLogsFilter);
        }
      });
    };
    fetchStagesLogs();

    const intervalId = setInterval(fetchStagesLogs, 30000); // 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Stack direction="column" spacing={2}>
      {stagesOrdinal.map((stage, index) => {
        const test1 = stagesData[stage] ? (
          <MainCard key={index} content={true} sx={{ mt: 1.5 }}>
            <AreaChart stageName={stage} stageData={stagesData[stage]} />
          </MainCard>
        ) : null;
        return test1;
      })}
    </Stack>
  );
};

export default StageRealTimeArea;
