'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { AppDispatch, RootState } from '@/store';
import { sendMessage } from '@/store/actions/chatActions';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { isLoading } = useSelector((state: RootState) => state.chat);
  const { currentSessionId } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch<AppDispatch>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Check if a session is selected
    if (!currentSessionId) {
      alert('Please select a chat session first');
      return;
    }

    const messageToSend = message.trim();
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await dispatch(sendMessage({ message: messageToSend, sessionId: currentSessionId })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="message-input-container border-top bg-white">
      <Container className="py-3">
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              ref={textareaRef}
              as="textarea"
              rows={1}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={currentSessionId ? "Type your message here... (Press Enter to send, Shift+Enter for new line)" : "Select a chat session to start messaging..."}
              disabled={isLoading || !currentSessionId}
              className="message-textarea border-0"
              style={{
                resize: 'none',
                minHeight: '44px',
                maxHeight: '120px',
              }}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!message.trim() || isLoading || !currentSessionId}
              className="send-button"
            >
              {isLoading ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <i className="bi bi-send-fill me-1"></i>
                  <span>Send</span>
                </>
              )}
            </Button>
          </InputGroup>
        </Form>

        <div className="input-hints mt-2">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Supports Markdown formatting. Use Shift+Enter for line breaks.
          </small>
        </div>
      </Container>
    </div>
  );
};

export default MessageInput;
