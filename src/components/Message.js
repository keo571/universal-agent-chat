import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import JsonTable from './JsonTable';
import DataVisualization from './DataVisualization';
import './Message.css';

const Message = React.memo(({ message, isUser, agentName, onImageClick }) => {
  return (
    <div className={`message ${isUser ? 'user-message' : 'agent-message'}`}>
      <div className="message-header">
        <span className="message-sender">{isUser ? 'You' : agentName}</span>
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">
        {isUser ? (
          <div className="user-query">{message.content}</div>
        ) : (
          <div className="agent-response">
            {/* 1. SQL Query */}
            {message.metadata?.sql && (
              <div className="sql-section">
                <h4>SQL Query:</h4>
                <pre className="sql-code">
                  <code>{message.metadata.sql}</code>
                </pre>
              </div>
            )}

            {/* 2. Data Table */}
            {message.results && (
              <div className="results-table">
                <JsonTable
                  data={message.results}
                  displayInfo={message.display_info}
                  queryId={message.query_id}
                />
              </div>
            )}

            {/* 3. Analysis */}
            {message.explanation && (
              <div className="explanation">
                <h4>Analysis:</h4>
                <ReactMarkdown>{message.explanation}</ReactMarkdown>
              </div>
            )}

            {/* 4. Chart (if visualization config provided) */}
            {message.visualization && (
              <DataVisualization
                visualization={message.visualization}
                data={message.results}
              />
            )}

            {/* Legacy: Keep image support for backward compatibility */}
            {message.visualization_path && (
              <div className="visualization">
                <img
                  src={message.visualization_path}
                  alt="Network Diagram"
                  className="diagram-image"
                  onClick={() => onImageClick(message.visualization_path)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

Message.displayName = 'Message';

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    explanation: PropTypes.string,
    visualization_path: PropTypes.string,
    results: PropTypes.any,
    isError: PropTypes.bool
  }).isRequired,
  isUser: PropTypes.bool.isRequired,
  agentName: PropTypes.string.isRequired,
  onImageClick: PropTypes.func.isRequired
};

export default Message;