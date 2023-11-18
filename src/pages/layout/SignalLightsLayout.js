import React from 'react';
import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import ROSLIB from 'roslib';

import RosPropsContext from 'context/RosPropsContext';
import CardMachine from './CardMachine';

import gs1Img from 'assets/images/machines/GS1-GS8.jpg';
import gs7Img from 'assets/images/machines/GS7.jpg';
import gr2Img from 'assets/images/machines/GR2.jpg';
import gr4Img from 'assets/images/machines/GR4.jpg';
import gc1Img from 'assets/images/machines/GC1-2.jpg';
import ln1Img from 'assets/images/machines/LN1.jpg';
import ln2Img from 'assets/images/machines/LN2.jpg';
import mc1Img from 'assets/images/machines/MC1-MC2.jpg';

function SignalLightsLayout({ width, height }) {
  const [machinesId, setMachinesId] = useState([]);

  const ros = useContext(RosPropsContext);

  useEffect(() => {
    var getMachinesNameClient = new ROSLIB.Service({
      ros: ros,
      name: '/get_all_machine_name',
      serviceType: 'vdm_cokhi_machine_msgs/GetAllMachineName',
    });

    let requestMachinesName = new ROSLIB.ServiceRequest({
      get_allname: true,
    });

    getMachinesNameClient.callService(requestMachinesName, function (result) {
      if (result.success) {
        setMachinesId(result.id_machines);
      }
    });
  }, []);

  return (
    <div>
      {/* GS01 */}
      <CardMachine
        stt={0}
        machineId={machinesId[0]}
        posLeft={width * 34.75}
        posTop={height * 4.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GS02 */}
      <CardMachine
        stt={1}
        machineId={machinesId[1]}
        posLeft={width * 23.82}
        posTop={height * 4.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GS03 */}
      <CardMachine
        stt={2}
        machineId={machinesId[2]}
        posLeft={width * 45.67}
        posTop={height * 4.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GS04 */}
      <CardMachine
        stt={3}
        machineId={machinesId[3]}
        posLeft={width * 29.3}
        posTop={height * 4.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GS05 */}
      <CardMachine
        stt={4}
        machineId={machinesId[4]}
        posLeft={width * 29.9}
        posTop={height * 23.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* Empty */}

      {/* GS07 */}
      <CardMachine
        stt={6}
        machineId={machinesId[6]}
        posLeft={width * 24}
        posTop={height * 22.4}
        size={width * 2.5}
        img={gs7Img}
      />

      {/* GS08 */}
      <CardMachine
        stt={7}
        machineId={machinesId[7]}
        posLeft={width * 40.23}
        posTop={height * 4.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GR2 */}
      <CardMachine
        stt={8}
        machineId={machinesId[8]}
        posLeft={width * 35.86}
        posTop={height * 31.8}
        size={width * 2.5}
        img={gr2Img}
      />

      {/* GR4 */}
      <CardMachine
        stt={9}
        machineId={machinesId[9]}
        posLeft={width * 41.23}
        posTop={height * 31.8}
        size={width * 2.5}
        img={gr4Img}
      />

      {/* GC1 */}
      <CardMachine
        stt={10}
        machineId={machinesId[10]}
        posLeft={width * 25.57}
        posTop={height * 32.6}
        size={width * 2.5}
        img={gc1Img}
      />

      {/* GC2 */}
      <CardMachine
        stt={11}
        machineId={machinesId[11]}
        posLeft={width * 30.29}
        posTop={height * 32.6}
        size={width * 2.5}
        img={gc1Img}
      />

      {/* LN1 */}
      <CardMachine
        stt={12}
        machineId={machinesId[12]}
        posLeft={width * 59.38}
        posTop={height * 32.58}
        size={width * 2.5}
        img={ln1Img}
      />

      {/* LN2 */}
      <CardMachine
        stt={13}
        machineId={machinesId[13]}
        posLeft={width * 51.68}
        posTop={height * 32.58}
        size={width * 2.5}
        img={ln2Img}
      />

      {/* MC01 */}
      <CardMachine
        stt={14}
        machineId={machinesId[14]}
        posLeft={width * 60.12}
        posTop={height * 6.5}
        size={width * 2.5}
        img={mc1Img}
      />

      {/* MC02 */}
      <CardMachine
        stt={15}
        machineId={machinesId[15]}
        posLeft={width * 53.53}
        posTop={height * 6.5}
        size={width * 2.5}
        img={mc1Img}
      />
    </div>
  );
}

SignalLightsLayout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default SignalLightsLayout;
