import React, { useState } from 'react';

const InputArea = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about medical information, differential diagnosis, treatment guidelines..."
          disabled={isLoading}
          rows={3}
        />
        <button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          className="send-button"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className="input-hint">
        💡 You can ask about medications, conditions, calculations, or guidelines
      </div>
    </form>
  );
};

export default InputArea;