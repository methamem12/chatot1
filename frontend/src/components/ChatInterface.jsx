import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import InputArea from './InputArea';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello Doctor! I'm your medical AI assistant. How can I help you today? I can assist with medical information, differential diagnosis, treatment guidelines, and more.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter(msg => msg.id !== 1) // Exclude initial greeting
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        isUser: false,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What are the first-line treatments for hypertension?",
    "Differential diagnosis for chest pain",
    "Calculate BMI for 70kg, 175cm",
    "Latest guidelines for type 2 diabetes management"
  ];

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map(message => (
          <Message
            key={message.id}
            text={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
            isError={message.isError}
          />
        ))}
        {isLoading && (
          <Message
            text="Thinking..."
            isUser={false}
            timestamp={new Date()}
            isLoading={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="suggested-questions">
          <h3>Quick Start Questions:</h3>
          <div className="question-chips">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="question-chip"
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;