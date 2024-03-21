import React from 'react';
import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import ROSLIB from 'roslib';

import RosPropsContext from 'context/RosPropsContext';
import CardMachine from './CardMachine';

import gs1Img from 'assets/images/machines/GS1-GS8.jpg';
import gs7Img from 'assets/images/machines/GS7.jpg';
import gr2Img from 'assets/images/machines/GR02.jpg';
import gr4Img from 'assets/images/machines/GR4.jpg';
import gc1Img from 'assets/images/machines/GC1-2.jpg';
import ln1Img from 'assets/images/machines/LN01.jpg';
import ln2Img from 'assets/images/machines/LN02.jpg';
import mc1Img from 'assets/images/machines/MC01.jpg';
import mc2Img from 'assets/images/machines/MC02.jpg';
import mc3Img from 'assets/images/machines/MC03.jpg';
import ma1Img from 'assets/images/machines/MA01.jpg';
import ma2Img from 'assets/images/machines/MA02.jpg';
import ma3Img from 'assets/images/machines/MA03.jpg';
import ma4Img from 'assets/images/machines/MA04.jpg';
import bj1Img from 'assets/images/machines/BJ01.jpg';
import bj3Img from 'assets/images/machines/BJ03.jpg';
import bj4Img from 'assets/images/machines/BJ04.jpg';
import bj6Img from 'assets/images/machines/BJ06.jpg';
import bj7Img from 'assets/images/machines/BJ07.jpg';
import la3Img from 'assets/images/machines/LA03.jpg';
import la4Img from 'assets/images/machines/LA04.jpg';
import la5Img from 'assets/images/machines/LA05.jpg';
import ew1Img from 'assets/images/machines/EW01.jpg';
import ew2Img from 'assets/images/machines/EW02.jpg';
import ew3Img from 'assets/images/machines/EW03.jpg';
import ew4Img from 'assets/images/machines/EW04.jpg';
import en1Img from 'assets/images/machines/EN01.jpg';
import en2Img from 'assets/images/machines/EN02.jpg';
import en3Img from 'assets/images/machines/EN03.jpg';
import ed2Img from 'assets/images/machines/ED02.jpg';
import gp2Img from 'assets/images/machines/GP02-03.jpg';
import gj2Img from 'assets/images/machines/GJ02-03.jpg';

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
        stt={5}
        machineId={machinesId[5]}
        posLeft={width * 24}
        posTop={height * 22.4}
        size={width * 2.5}
        img={gs7Img}
      />

      {/* GS08 */}
      <CardMachine
        stt={6}
        machineId={machinesId[6]}
        posLeft={width * 40.23}
        posTop={height * 4.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GR2 */}
      <CardMachine
        stt={7}
        machineId={machinesId[7]}
        posLeft={width * 35.86}
        posTop={height * 31.8}
        size={width * 2.5}
        img={gr2Img}
      />

      {/* GR4 */}
      <CardMachine
        stt={8}
        machineId={machinesId[8]}
        posLeft={width * 41.23}
        posTop={height * 31.8}
        size={width * 2.5}
        img={gr4Img}
      />

      {/* GC1 */}
      <CardMachine
        stt={9}
        machineId={machinesId[9]}
        posLeft={width * 25.57}
        posTop={height * 32.6}
        size={width * 2.5}
        img={gc1Img}
      />

      {/* GC2 */}
      <CardMachine
        stt={10}
        machineId={machinesId[10]}
        posLeft={width * 30.29}
        posTop={height * 32.6}
        size={width * 2.5}
        img={gc1Img}
      />

      {/* LN1 */}
      <CardMachine
        stt={11}
        machineId={machinesId[11]}
        posLeft={width * 59.38}
        posTop={height * 32.58}
        size={width * 2.5}
        img={ln1Img}
      />

      {/* LN2 */}
      <CardMachine
        stt={12}
        machineId={machinesId[12]}
        posLeft={width * 51.68}
        posTop={height * 32.58}
        size={width * 2.5}
        img={ln2Img}
      />

      {/* MC01 */}
      <CardMachine
        stt={13}
        machineId={machinesId[13]}
        posLeft={width * 60.12}
        posTop={height * 6.5}
        size={width * 2.5}
        img={mc1Img}
      />

      {/* MC02 */}
      <CardMachine
        stt={14}
        machineId={machinesId[14]}
        posLeft={width * 53.53}
        posTop={height * 6.5}
        size={width * 2.5}
        img={mc2Img}
      />

      {/* MC03 */}
      <CardMachine
        stt={15}
        machineId={machinesId[15]}
        posLeft={width * 69.65}
        posTop={height * 7.9}
        size={width * 2.5}
        img={mc3Img}
      />

      {/* MA01 */}
      <CardMachine
        stt={16}
        machineId={machinesId[16]}
        posLeft={width * 69.28}
        posTop={height * 43.1}
        size={width * 2.5}
        img={ma1Img}
      />

      {/* MA02 */}
      <CardMachine
        stt={17}
        machineId={machinesId[17]}
        posLeft={width * 58.5}
        posTop={height * 43.1}
        size={width * 2.5}
        img={ma2Img}
      />

      {/* MA03 */}
      <CardMachine
        stt={18}
        machineId={machinesId[18]}
        posLeft={width * 52.95}
        posTop={height * 43.1}
        size={width * 2.5}
        img={ma3Img}
      />

      {/* MA04 */}
      <CardMachine
        stt={19}
        machineId={machinesId[19]}
        posLeft={width * 64.14}
        posTop={height * 43.1}
        size={width * 2.5}
        img={ma4Img}
      />

      {/* BJ01 */}
      <CardMachine
        stt={20}
        machineId={machinesId[20]}
        posLeft={width * 66.69}
        posTop={height * 74.2}
        size={width * 2.5}
        img={bj1Img}
      />

      {/* BJ03 */}
      <CardMachine
        stt={21}
        machineId={machinesId[21]}
        posLeft={width * 70.6}
        posTop={height * 74.2}
        size={width * 2.5}
        img={bj3Img}
      />

      {/* BJ04 */}
      <CardMachine
        stt={22}
        machineId={machinesId[22]}
        posLeft={width * 74.75}
        posTop={height * 74.2}
        size={width * 2.5}
        img={bj4Img}
      />

      {/* BJ06 */}
      <CardMachine
        stt={23}
        machineId={machinesId[23]}
        posLeft={width * 56.17}
        posTop={height * 74.2}
        size={width * 2.5}
        img={bj6Img}
      />

      {/* BJ07 */}
      <CardMachine
        stt={24}
        machineId={machinesId[24]}
        posLeft={width * 60.6}
        posTop={height * 74.2}
        size={width * 2.5}
        img={bj7Img}
      />

      {/* LA03 */}
      <CardMachine
        stt={25}
        machineId={machinesId[25]}
        posLeft={width * 59}
        posTop={height * 84.3}
        size={width * 2.5}
        img={la3Img}
      />

      {/* LA04 */}
      <CardMachine
        stt={26}
        machineId={machinesId[26]}
        posLeft={width * 65}
        posTop={height * 84.3}
        size={width * 2.5}
        img={la4Img}
      />

      {/* LA05 */}
      <CardMachine
        stt={27}
        machineId={machinesId[27]}
        posLeft={width * 53}
        posTop={height * 84.3}
        size={width * 2.5}
        img={la5Img}
      />

      {/* EW01 */}
      <CardMachine
        stt={28}
        machineId={machinesId[28]}
        posLeft={width * 2.5}
        posTop={height * 86.3}
        size={width * 2.5}
        img={ew1Img}
      />

      {/* EW02 */}
      <CardMachine
        stt={29}
        machineId={machinesId[29]}
        posLeft={width * 2.5}
        posTop={height * 72.8}
        size={width * 2.5}
        img={ew2Img}
      />

      {/* EW03 */}
      <CardMachine
        stt={30}
        machineId={machinesId[30]}
        posLeft={width * 17.2}
        posTop={height * 80.8}
        size={width * 2.5}
        img={ew3Img}
      />

      {/* EW04 */}
      <CardMachine
        stt={31}
        machineId={machinesId[31]}
        posLeft={width * 16.4}
        posTop={height * 47.8}
        size={width * 2.5}
        img={ew4Img}
      />

      {/* EN01 */}
      <CardMachine
        stt={32}
        machineId={machinesId[32]}
        posLeft={width * 2.5}
        posTop={height * 61.6}
        size={width * 2.5}
        img={en1Img}
      />

      {/* EN02 */}
      <CardMachine
        stt={33}
        machineId={machinesId[33]}
        posLeft={width * 2.5}
        posTop={height * 50.4}
        size={width * 2.5}
        img={en2Img}
      />

      {/* EN03 */}
      <CardMachine
        stt={34}
        machineId={machinesId[34]}
        posLeft={width * 2.5}
        posTop={height * 38.4}
        size={width * 2.5}
        img={en3Img}
      />

      {/* ED02 */}
      <CardMachine
        stt={35}
        machineId={machinesId[35]}
        posLeft={width * 15.98}
        posTop={height * 36.2}
        size={width * 2.5}
        img={ed2Img}
      />

      {/* GP02 */}
      <CardMachine
        stt={36}
        machineId={machinesId[36]}
        posLeft={width * 16.72}
        posTop={height * 19.1}
        size={width * 2.5}
        img={gp2Img}
      />

      {/* GP03 */}
      <CardMachine
        stt={37}
        machineId={machinesId[37]}
        posLeft={width * 16.72}
        posTop={height * 4.9}
        size={width * 2.5}
        img={gp2Img}
      />

      {/* GJ02 */}
      <CardMachine
        stt={38}
        machineId={machinesId[38]}
        posLeft={width * 2.5}
        posTop={height * 10.9}
        size={width * 2.5}
        img={gj2Img}
      />

      {/* GJ03 */}
      <CardMachine
        stt={39}
        machineId={machinesId[39]}
        posLeft={width * 2.5}
        posTop={height * 23.4}
        size={width * 2.5}
        img={gj2Img}
      />
    </div>
  );
}

SignalLightsLayout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default SignalLightsLayout;
