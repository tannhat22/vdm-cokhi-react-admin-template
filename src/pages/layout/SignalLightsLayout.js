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
// import bj3Img from 'assets/images/machines/BJ03.jpg';
import bj4Img from 'assets/images/machines/BJ04.jpg';
import bj6Img from 'assets/images/machines/BJ06.jpg';
import bj7Img from 'assets/images/machines/BJ07.jpg';
import bj8Img from 'assets/images/machines/BJ08.jpg';
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
import en4Img from 'assets/images/machines/EN04.jpg';
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
      serviceType: 'vdm_machine_msgs/GetAllMachineName',
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
    <>
      {/* GS01 */}
      <CardMachine
        stt={0}
        machineId={machinesId[0] ? machinesId[0] : 0}
        posLeft={width * 34.75}
        posTop={height * 5.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GS02 */}
      <CardMachine
        stt={1}
        machineId={machinesId[1] ? machinesId[1] : 1}
        posLeft={width * 23.82}
        posTop={height * 5.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GS03 */}
      <CardMachine
        stt={2}
        machineId={machinesId[2] ? machinesId[2] : 2}
        posLeft={width * 45.67}
        posTop={height * 5.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GS04 */}
      <CardMachine
        stt={3}
        machineId={machinesId[3] ? machinesId[3] : 3}
        posLeft={width * 29.3}
        posTop={height * 5.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GS05 */}
      <CardMachine
        stt={4}
        machineId={machinesId[4] ? machinesId[4] : 4}
        posLeft={width * 29.9}
        posTop={height * 24.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* Empty */}

      {/* GS07 */}
      <CardMachine
        stt={5}
        machineId={machinesId[5] ? machinesId[5] : 5}
        posLeft={width * 24}
        posTop={height * 23.4}
        size={width * 2.5}
        img={gs7Img}
      />

      {/* GS08 */}
      <CardMachine
        stt={6}
        machineId={machinesId[6] ? machinesId[6] : 6}
        posLeft={width * 40.23}
        posTop={height * 5.3}
        size={width * 2.5}
        img={gs1Img}
      />

      {/* GR2 */}
      <CardMachine
        stt={7}
        machineId={machinesId[7] ? machinesId[7] : 7}
        posLeft={width * 44.7}
        posTop={height * 42.5}
        size={width * 2.5}
        img={gr2Img}
      />

      {/* GR4 */}
      <CardMachine
        stt={8}
        machineId={machinesId[8] ? machinesId[8] : 8}
        posLeft={width * 44.7}
        posTop={height * 31.5}
        size={width * 2.5}
        img={gr4Img}
      />

      {/* GC1 */}
      <CardMachine
        stt={9}
        machineId={machinesId[9] ? machinesId[9] : 9}
        posLeft={width * 24.3}
        posTop={height * 33}
        size={width * 2.5}
        img={gc1Img}
      />

      {/* GC2 */}
      <CardMachine
        stt={10}
        machineId={machinesId[10] ? machinesId[10] : 10}
        posLeft={width * 28.9}
        posTop={height * 33}
        size={width * 2.5}
        img={gc1Img}
      />

      {/* LN1 */}
      <CardMachine
        stt={11}
        machineId={machinesId[11] ? machinesId[11] : 11}
        posLeft={width * 59.55}
        posTop={height * 33.2}
        size={width * 2.5}
        img={ln1Img}
      />

      {/* LN2 */}
      <CardMachine
        stt={12}
        machineId={machinesId[12] ? machinesId[12] : 12}
        posLeft={width * 52.3}
        posTop={height * 33.2}
        size={width * 2.5}
        img={ln2Img}
      />

      {/* MC01 */}
      <CardMachine
        stt={13}
        machineId={machinesId[13] ? machinesId[13] : 13}
        posLeft={width * 60.5}
        posTop={height * 7.5}
        size={width * 2.5}
        img={mc1Img}
      />

      {/* MC02 */}
      <CardMachine
        stt={14}
        machineId={machinesId[14] ? machinesId[14] : 14}
        posLeft={width * 54}
        posTop={height * 7.5}
        size={width * 2.5}
        img={mc2Img}
      />

      {/* MC03 */}
      <CardMachine
        stt={15}
        machineId={machinesId[15] ? machinesId[15] : 15}
        posLeft={width * 69.7}
        posTop={height * 8.5}
        size={width * 2.5}
        img={mc3Img}
      />

      {/* MA01 */}
      <CardMachine
        stt={16}
        machineId={machinesId[16] ? machinesId[16] : 16}
        posLeft={width * 69.28}
        posTop={height * 43.3}
        size={width * 2.5}
        img={ma1Img}
      />

      {/* MA02 */}
      <CardMachine
        stt={17}
        machineId={machinesId[17] ? machinesId[17] : 17}
        posLeft={width * 58.9}
        posTop={height * 43.3}
        size={width * 2.5}
        img={ma2Img}
      />

      {/* MA03 */}
      <CardMachine
        stt={18}
        machineId={machinesId[18] ? machinesId[18] : 18}
        posLeft={width * 53.3}
        posTop={height * 43.3}
        size={width * 2.5}
        img={ma3Img}
      />

      {/* MA04 */}
      <CardMachine
        stt={19}
        machineId={machinesId[19] ? machinesId[19] : 19}
        posLeft={width * 64.4}
        posTop={height * 43.3}
        size={width * 2.5}
        img={ma4Img}
      />

      {/* BJ01 */}
      <CardMachine
        stt={20}
        machineId={machinesId[20] ? machinesId[20] : 20}
        posLeft={width * 64.5}
        posTop={height * 73.7}
        size={width * 2.5}
        img={bj1Img}
      />

      {/* BJ08 */}
      <CardMachine
        stt={21}
        machineId={machinesId[21] ? machinesId[21] : 21}
        posLeft={width * 51.3}
        posTop={height * 73.35}
        size={width * 2.5}
        img={bj8Img}
      />

      {/* BJ04 */}
      <CardMachine
        stt={22}
        machineId={machinesId[22] ? machinesId[22] : 22}
        posLeft={width * 68.9}
        posTop={height * 74}
        size={width * 2.5}
        img={bj4Img}
      />

      {/* BJ06 */}
      <CardMachine
        stt={23}
        machineId={machinesId[23] ? machinesId[23] : 23}
        posLeft={width * 55.5}
        posTop={height * 73.7}
        size={width * 2.5}
        img={bj6Img}
      />

      {/* BJ07 */}
      <CardMachine
        stt={24}
        machineId={machinesId[24] ? machinesId[24] : 24}
        posLeft={width * 59.8}
        posTop={height * 73.7}
        size={width * 2.5}
        img={bj7Img}
      />

      {/* LA03 */}
      <CardMachine
        stt={25}
        machineId={machinesId[25] ? machinesId[25] : 25}
        posLeft={width * 59}
        posTop={height * 84.3}
        size={width * 2.5}
        img={la3Img}
      />

      {/* LA04 */}
      <CardMachine
        stt={26}
        machineId={machinesId[26] ? machinesId[26] : 26}
        posLeft={width * 65}
        posTop={height * 84.3}
        size={width * 2.5}
        img={la4Img}
      />

      {/* LA05 */}
      <CardMachine
        stt={27}
        machineId={machinesId[27] ? machinesId[27] : 27}
        posLeft={width * 53}
        posTop={height * 84.3}
        size={width * 2.5}
        img={la5Img}
      />

      {/* EW01 */}
      <CardMachine
        stt={28}
        machineId={machinesId[28] ? machinesId[28] : 28}
        posLeft={width * 2.5}
        posTop={height * 86.3}
        size={width * 2.5}
        img={ew1Img}
      />

      {/* EW02 */}
      <CardMachine
        stt={29}
        machineId={machinesId[29] ? machinesId[29] : 29}
        posLeft={width * 2.5}
        posTop={height * 72.8}
        size={width * 2.5}
        img={ew2Img}
      />

      {/* EW03 */}
      <CardMachine
        stt={30}
        machineId={machinesId[30] ? machinesId[30] : 30}
        posLeft={width * 16.65}
        posTop={height * 75.5}
        size={width * 2.5}
        img={ew3Img}
      />

      {/* EW04 */}
      <CardMachine
        stt={31}
        machineId={machinesId[31] ? machinesId[31] : 31}
        posLeft={width * 16.55}
        posTop={height * 51.2}
        size={width * 2.5}
        img={ew4Img}
      />

      {/* EN01 */}
      <CardMachine
        stt={32}
        machineId={machinesId[32] ? machinesId[32] : 32}
        posLeft={width * 2.5}
        posTop={height * 61.6}
        size={width * 2.5}
        img={en1Img}
      />

      {/* EN02 */}
      <CardMachine
        stt={33}
        machineId={machinesId[33] ? machinesId[33] : 33}
        posLeft={width * 2.5}
        posTop={height * 50.4}
        size={width * 2.5}
        img={en2Img}
      />

      {/* EN03 */}
      <CardMachine
        stt={34}
        machineId={machinesId[34] ? machinesId[34] : 34}
        posLeft={width * 2.5}
        posTop={height * 38.4}
        size={width * 2.5}
        img={en3Img}
      />

      {/* EN04 */}
      <CardMachine
        stt={40}
        machineId={machinesId[40] ? machinesId[40] : 40}
        posLeft={width * 16.55}
        posTop={height * 33}
        size={width * 2.5}
        img={en4Img}
      />

      {/* ED02 */}
      <CardMachine
        stt={35}
        machineId={machinesId[35] ? machinesId[35] : 35}
        posLeft={width * 16.5}
        posTop={height * 86.3}
        size={width * 2.5}
        img={ed2Img}
      />

      {/* GP02 */}
      <CardMachine
        stt={36}
        machineId={machinesId[36] ? machinesId[36] : 36}
        posLeft={width * 16.8}
        posTop={height * 20.3}
        size={width * 2.5}
        img={gp2Img}
      />

      {/* GP03 */}
      <CardMachine
        stt={37}
        machineId={machinesId[37] ? machinesId[37] : 37}
        posLeft={width * 16.8}
        posTop={height * 5.5}
        size={width * 2.5}
        img={gp2Img}
      />

      {/* GJ02 */}
      <CardMachine
        stt={38}
        machineId={machinesId[38] ? machinesId[38] : 38}
        posLeft={width * 2.5}
        posTop={height * 11.7}
        size={width * 2.5}
        img={gj2Img}
      />

      {/* GJ03 */}
      <CardMachine
        stt={39}
        machineId={machinesId[39] ? machinesId[39] : 39}
        posLeft={width * 2.5}
        posTop={height * 23.7}
        size={width * 2.5}
        img={gj2Img}
      />
    </>
  );
}

SignalLightsLayout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default SignalLightsLayout;
