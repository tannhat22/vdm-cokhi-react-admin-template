import React from 'react';
import PropTypes from 'prop-types';

import './SignalLight.css';

function SignalLight({ color, size }) {
  return size ? (
    <div className={`led-box-${size}`}>
      <div className={`led-${color}-${size}`}></div>
    </div>
  ) : (
    <div className="led-box">
      <div className={`led-${color}`}></div>
    </div>
  );
}

SignalLight.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

export default SignalLight;
