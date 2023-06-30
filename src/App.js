import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (inputValue.trim() !== '') {
    const userMessage = { content: inputValue, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');

    setIsLoading(true);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: inputValue }),
    };

    try {
      const response = await fetch('/feedback', requestOptions);
      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();
      const botMessageList = Object.entries(data).map(([key, value]) => ({
        content: value,
        sender: 'bot',
        id: key,
      }));
      setMessages((prevMessages) => [...prevMessages, ...botMessageList]);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }
};

  return (
    <div className="app">
      <div className="sidebar">
        <h1 className="sidebar-heading">Code <span style={{color:"#007bff"}} >Review</span> Bot</h1>
        <p className="sidebar-developer">Developed by @Harish Carpenter</p>
      </div>
      <div className="chat-container" id="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              {message.sender === 'user' ? 'User: ' : 'Bot: '}
              {message.content}
            </div>
          ))}
          {isLoading && <div className="message bot">Bot: Loading...</div>}
        </div>
        <div className="input-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter a GitHub repository link..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
