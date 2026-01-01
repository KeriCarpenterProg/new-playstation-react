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
    // Check if API URL is localhost (development) or not (production)
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const isLocalDevelopment = apiUrl.includes('localhost');
    
    const [messages, setMessages] = useState([
        {
            role:  'assistant',
            content: isLocalDevelopment 
                ? '👋 Hi! I\'m a ChatGPT like assistant focused on PlayStation Games that I have in my database.\n.'
                : '👋 Hi! I\'m the PlayStation AI Assistant.\n\n⚠️ **Demo Mode**: This feature requires a local Ollama instance running Llama 3. The chat functionality is currently disabled in production but fully functional in local development.\n\nThis demonstrates: \n• AI/ML integration with React\n• RAG (Retrieval Augmented Generation)\n• Real-time database queries\n• Conversational UI/UX\n\nTo see it in action, check out the GitHub repo or run locally!',
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
    // Only scroll if there are messages in the chat
    if (messages.length > 1) {
    scrollToBottom();
    }
  }, [messages]);   

const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isLocalDevelopment) return;

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
          <h2 className='text-center'>🎮 PlayStation AI Assistant</h2>
          <p>Powered by the Llama 3 open-source model with RAG (Retrieval Augmented Generation) 
          technology that searches the PostgreSQL game database in real-time.</p>
          <p>The database is a PostgreSQL database backend. The data is imported from the <a href="https://www.igdb.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#a8b3ff' }}>Internet Game Database (IGDB)</a>, a comprehensive, community-driven online platform and database for video games which is owned by Twitch.</p>
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
            placeholder={isLocalDevelopment ? "Ask about PlayStation games..." : "Chat disabled in production (requires local Ollama)"}
            className="chat-input"
            rows="2"
            disabled={isLoading || !isLocalDevelopment}
          />
          <Button
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || !isLocalDevelopment}
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