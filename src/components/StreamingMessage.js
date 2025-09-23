import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import PaginatedTable from './PaginatedTable';
import DataVisualization from './DataVisualization';
import './Message.css';

const StreamingMessage = React.memo(({
  message,
  isUser,
  agentName,
  onImageClick,
  streamingSpeed = 30  // milliseconds per character
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!isUser && message.content) {
      setIsStreaming(true);
      let currentIndex = 0;

      const streamInterval = setInterval(() => {
        if (currentIndex < message.content.length) {
          // Add characters in chunks for smoother display
          const chunkSize = Math.min(3, message.content.length - currentIndex);
          setDisplayedContent(message.content.slice(0, currentIndex + chunkSize));
          currentIndex += chunkSize;
        } else {
          clearInterval(streamInterval);
          setIsStreaming(false);
        }
      }, streamingSpeed);

      return () => clearInterval(streamInterval);
    } else if (isUser) {
      setDisplayedContent(message.content);
    }
  }, [message.content, isUser, streamingSpeed]);

  const handleSkipStreaming = () => {
    setDisplayedContent(message.content);
    setIsStreaming(false);
  };

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
          <div className="user-query">{displayedContent}</div>
        ) : (
          <div className="agent-response">
            <div className="response-text">
              <ReactMarkdown>{displayedContent}</ReactMarkdown>
              {isStreaming && (
                <span className="cursor-blink">▊</span>
              )}
            </div>

            {isStreaming && (
              <button
                className="skip-streaming-btn"
                onClick={handleSkipStreaming}
              >
                Skip animation
              </button>
            )}

            {!isStreaming && message.visualization_path && (
              <div className="visualization fade-in">
                <img
                  src={message.visualization_path}
                  alt="Network Diagram"
                  className="diagram-image"
                  onClick={() => onImageClick(message.visualization_path)}
                />
              </div>
            )}

            {!isStreaming && message.results && (
              <div className="results-table fade-in">
                <PaginatedTable
                  data={message.results}
                  pageSize={message.display_info?.initial_display || 20}
                  maxDisplay={message.results.length}
                  displayInfo={message.display_info}
                  queryId={message.query_id}
                />
              </div>
            )}

            {!isStreaming && message.explanation && (
              <div className={`explanation fade-in ${!displayedContent && !message.visualization_path ? 'no-border' : ''}`}>
                <ReactMarkdown>{message.explanation}</ReactMarkdown>
              </div>
            )}

            {!isStreaming && message.visualization && (
              <div className="visualization fade-in">
                <DataVisualization
                  visualization={message.visualization}
                  data={message.results}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

StreamingMessage.displayName = 'StreamingMessage';

StreamingMessage.propTypes = {
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
  onImageClick: PropTypes.func.isRequired,
  streamingSpeed: PropTypes.number
};

export default StreamingMessage;