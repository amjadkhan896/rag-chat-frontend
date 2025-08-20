'use client';

import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearError } from '@/store/actions/chatActions';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';

const ChatContainer: React.FC = () => {
  const { error } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const handleDismissError = () => {
    dispatch(clearError());
  };

  return (
    <div className="chat-container d-flex flex-column vh-100">
      {/* Header */}
      <header className="chat-header border-bottom bg-white sticky-top">
        <div className="container-fluid">
          <Row className="align-items-center py-3">
            <Col>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-link p-0 me-3 d-md-none mobile-menu-btn"
                  onClick={() => {
                    const sidebar = document.querySelector('.sidebar-column') as HTMLElement;
                    if (sidebar) {
                      sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
                    }
                  }}
                >
                  <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
                </button>

                <div className="logo me-3">
                  <i className="bi bi-robot text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div>
                  <h4 className="mb-0">RAG Chat Assistant</h4>
                  <small className="text-muted">Powered by AI and your knowledge base</small>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={handleDismissError}
          className="mb-0 rounded-0"
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Error:</strong> {error}
          </div>
        </Alert>
      )}

      {/* Main Layout - 2 Column */}
      <main className="chat-main flex-grow-1 d-flex overflow-hidden">
        {/* Left Sidebar - Always Visible */}
        <div className="sidebar-column">
          <Sidebar />
        </div>

        {/* Right Chat Area */}
        <div className="chat-column flex-grow-1 d-flex flex-column">
          <MessageList />
          <MessageInput />
        </div>
      </main>
    </div>
  );
};

export default ChatContainer;
