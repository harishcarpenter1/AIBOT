import React, { useState } from 'react';
import './App.css';
import userIcon from './Images/User.gif';
import botIcon from './Images/Bot.gif';
import LoadingIcon from './Images/Loading.gif';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

        const fileBlob = await response.blob();
        const url = URL.createObjectURL(fileBlob);

        const botMessage = {
          content: (
            <button className="download-button">
              <a href={url} download="feedback.html">
                Download the feedback file
              </a>
            </button>
          ),
          sender: 'bot',
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
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
        <h1 className="sidebar-heading">
          Code <span style={{ color: '#007bff' }}>Review</span> Bot
        </h1>
        <p className="sidebar-developer">Developed by @Harish Carpenter</p>
      </div>

      <div className="chat-container" id="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <img src={message.sender === 'user' ? userIcon : botIcon} alt={message.sender} className="icon" />
              <span className="message-content">{message.content}</span>
            </div>
          ))}
          {isLoading && <div className="message bot"><img src={LoadingIcon} alt="loading..." /></div>}
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
