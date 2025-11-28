import React from 'react';
import ChatInterface from './components/ChatInterface';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Medical Assistant Chatbot</h1>
        <p>AI-powered support for healthcare professionals</p>
      </header>
      <main className="app-main">
        <ChatInterface />
      </main>
      <footer className="app-footer">
        <p>Important: This AI assistant supports medical professionals but does not replace clinical judgment.</p>
      </footer>
    </div>
  );
}

export default App;