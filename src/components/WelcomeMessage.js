import React from 'react';
import PropTypes from 'prop-types';
import './WelcomeMessage.css';

const WelcomeMessage = ({ title, message }) => {
  return (
    <div className="welcome-message">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};

WelcomeMessage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default WelcomeMessage;