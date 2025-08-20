'use client';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { RootState } from '@/store';
import MessageBubble from './MessageBubble';

const MessageList: React.FC = () => {
  const { messages } = useSelector((state: RootState) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list-container flex-grow-1 overflow-auto">
      <Container className="py-3">
        {messages.length === 0 ? (
          <div className="empty-state text-center py-5">
            <div className="mb-4">
              <i className="bi bi-chat-dots-fill text-muted" style={{ fontSize: '4rem' }}></i>
            </div>
            <h4 className="text-muted mb-3">Welcome to RAG Chat</h4>
            <p className="text-muted">
              Start a conversation by typing your message below. I'm here to help you with any questions!
            </p>

          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </Container>
    </div>
  );
};

export default MessageList;
