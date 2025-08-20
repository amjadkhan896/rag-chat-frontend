'use client';

import React from 'react';
import { Card } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`mb-3 d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`message-bubble ${isUser ? 'user-message' : 'assistant-message'}`}>
        {!isUser && (
          <div className="d-flex align-items-center mb-2">
            <div className="assistant-avatar me-2">
              <i className="bi bi-robot"></i>
            </div>
            <small className="text-muted">Assistant</small>
          </div>
        )}

        <Card className={`border-0 ${isUser ? 'bg-primary text-white' : 'bg-light'}`}>
          <Card.Body className="p-3">
            {isUser ? (
              <div className="user-message-content">{message.content}</div>
            ) : (
              <div className="assistant-message-content">
                <ReactMarkdown
                  components={{
                    code({ className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match;
                      return !isInline ? (
                        <SyntaxHighlighter
                          style={tomorrow as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {message.isStreaming && (
                  <div className="typing-indicator mt-2">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                )}
              </div>
            )}

            <div className="message-timestamp mt-2">
              <small className={`${isUser ? 'text-white-50' : 'text-muted'}`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </small>
            </div>
          </Card.Body>
        </Card>

        {isUser && (
          <div className="d-flex align-items-center justify-content-end mt-2">
            <small className="text-muted me-2">You</small>
            <div className="user-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
