import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Row,
    Col,
    Input,
    Button,
    Spinner
} from 'reactstrap';
import './ChatPage.css';

const ChatPage = () => {
    // Check if API URL is localhost (development) or not (production)
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    const [messages, setMessages] = useState([
        {
            role:  'assistant',
            content: '👋 Hi! I\'m a ChatGPT-like AI Chatbot powered by Llama 3 via Groq API.',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

 // Auto-scroll to bottom when new messages arrive
const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    // Only scroll if there are messages in the chat
    if (messages.length > 1) {
    scrollToBottom();
    }
  }, [messages]);   

const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
        const conversationHistory = messages
        .slice(-10)
        .map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const response = await fetch(`${apiUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: inputMessage, 
                conversationHistory 
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from server');
        }

        const data = await response.json();
        const assistantMessage = {
            role: 'assistant',
            content: data.response,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        setIsLoading(false);
    }
};

const handleInputChange = (e) => {
    setInputMessage(e.target.value);
};

const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
};

   return (
  <Container fluid className="chat-page">
    <Row className="h-100">
      <Col md="8" className="chat-main">
        <div className="chat-header">
          <h2 className='text-center'>🎮 ChatGPT-like AI Chatbot</h2>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-content">
                <div className="message-text">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message assistant-message">
              <div className="message-content">
                <Spinner size="sm" color="primary" /> Thinking...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <Input
            type="textarea"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about PlayStation games..."
            className="chat-input"
            rows="2"
            disabled={isLoading}
          />
          <Button
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            Send
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
);
};

export default ChatPage;