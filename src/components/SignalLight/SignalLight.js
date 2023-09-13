import React from 'react';
import PropTypes from 'prop-types';

import './SignalLight.css';

function SignalLight({ color }) {
  return (
    <div className="led-box">
      <div className={`led-${color}`}></div>
    </div>
  );
}

SignalLight.propTypes = {
  color: PropTypes.string,
};

export default SignalLight;
