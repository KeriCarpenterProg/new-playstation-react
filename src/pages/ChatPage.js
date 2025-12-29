import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Row,
    Col,
    Input,
    Button,
    Card,
    CardBody,
    Badge,
    Spinner
} from 'reactstrap';
import './ChatPage.css';

const ChatPage = () => {
    // State will go here
    const [messages, setMessages] = useState([
        {
            role:  'assistant',
            content: '👋 Hi! I\'m your PlayStation gaming assistant.  Ask me anything about PlayStation games!',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [gameContext, setGameContext] = useState([]);
    const messagesEndRef = useRef(null);

 // Auto-scroll to bottom when new messages arrive
const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
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

        const response = await fetch('http://localhost:3001/chat', {
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
        setGameContext(data.gameContext);
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
          <h3>🎮 PlayStation AI Assistant</h3>
          <p className="text-muted">Powered by Llama 3</p>
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