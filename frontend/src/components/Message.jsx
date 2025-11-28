import React from 'react';

const Message = ({ text, isUser, timestamp, isLoading, isError }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'} ${isError ? 'error-message' : ''}`}>
      <div className="message-avatar">
        {isUser ? '👨‍⚕️' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-text">
          {isLoading ? (
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            text
          )}
        </div>
        <div className="message-timestamp">
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;