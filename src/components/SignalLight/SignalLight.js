import React from 'react';
import PropTypes from 'prop-types';

import './SignalLight.css';

function SignalLight({ color, size, custom }) {
  return custom ? (
    <div className={`led-box-${custom}`} style={{ height: `${size}px` }}>
      <div className={`led-${color}-${custom}`} style={{ width: `${size}px`, height: `${size}px` }}></div>
    </div>
  ) : size ? (
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
  custom: PropTypes.string,
};

export default SignalLight;
