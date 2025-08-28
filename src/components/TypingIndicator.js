import React from 'react';
import PropTypes from 'prop-types';
import './TypingIndicator.css';

const TypingIndicator = ({ agentName }) => {
  return (
    <div className="message agent-message loading">
      <div className="message-header">
        <span className="message-sender">{agentName}</span>
      </div>
      <div className="message-content">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

TypingIndicator.propTypes = {
  agentName: PropTypes.string.isRequired
};

export default TypingIndicator;