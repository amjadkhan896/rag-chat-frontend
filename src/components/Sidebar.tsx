'use client';

import React, { useState, useEffect } from 'react';
import { Button, Nav, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessages, loadSessionMessages } from '@/store/actions/chatActions';
import { createChatSession, fetchChatSessions, setCurrentSession, deleteChatSession, updateChatSession, toggleSessionFavorite, renameSession } from '@/store/actions/sessionActions';
import { AppDispatch, RootState } from '@/store';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, currentSessionId, isCreatingSession } = useSelector((state: RootState) => state.session);
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);



  // Load sessions on component mount
  useEffect(() => {
    dispatch(fetchChatSessions());
  }, [dispatch]);

  const handleNewChat = () => {
    setShowNewChatInput(true);
  };

  const handleCreateSession = async () => {
    if (newChatTitle.trim()) {
      try {
        await dispatch(createChatSession(newChatTitle.trim())).unwrap();
        setNewChatTitle('');
        setShowNewChatInput(false);
        dispatch(clearMessages());
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    }
  };

  const handleCancelNewChat = () => {
    setShowNewChatInput(false);
    setNewChatTitle('');
  };

  const handleSessionSelect = async (sessionId: string) => {
    try {
      // Clear any editing state
      if (editingSessionId) {
        setEditingSessionId(null);
        setEditingTitle('');
      }

      // Dispatch the session selection action
      dispatch(setCurrentSession(sessionId));

      // Load messages for the selected session
      await dispatch(loadSessionMessages(sessionId)).unwrap();

    } catch (error) {
      console.error('❌ Failed to load session messages:', error);
      // Clear messages if loading fails
      dispatch(clearMessages());
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      // Find the session to get its title for confirmation
      const sessionToDelete = sessions.find(s => s.id === sessionId);
      const sessionTitle = sessionToDelete?.title || 'this session';

      // Ask for confirmation
      const confirmed = window.confirm(`Are you sure you want to delete "${sessionTitle}"? This action cannot be undone.`);
      if (!confirmed) {
        setOpenDropdownId(null);
        return;
      }

      // Close the dropdown first
      setOpenDropdownId(null);

      // Call the API to delete the session
      await dispatch(deleteChatSession(sessionId)).unwrap();

      // If we deleted the current session, clear the messages
      if (currentSessionId === sessionId) {
        dispatch(clearMessages());
      }

      // Refresh the session list to ensure UI is in sync
      await dispatch(fetchChatSessions());

    } catch (error) {
      console.error('❌ Failed to delete session:', error);
      // Close dropdown even if delete fails
      setOpenDropdownId(null);
    }
  };

  const handleRenameSession = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
    setOpenDropdownId(null); // Close dropdown when entering edit mode
  };

  const handleSaveRename = async () => {
    if (editingSessionId && editingTitle.trim()) {
      try {
        // Call the API to rename the session using PATCH endpoint
        await dispatch(renameSession({
          sessionId: editingSessionId,
          title: editingTitle.trim()
        })).unwrap();

        // Clear editing state
        setEditingSessionId(null);
        setEditingTitle('');

        // Refresh the session list to get updated data
        await dispatch(fetchChatSessions());

      } catch (error) {
        console.error('❌ Failed to rename session:', error);
      }
    }
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleToggleFavorite = async (sessionId: string, currentFavorite: boolean) => {
    try {
      // Close dropdown first
      setOpenDropdownId(null);

      // Call the API to toggle favorite using PATCH endpoint
      await dispatch(toggleSessionFavorite(sessionId)).unwrap();

      // Refresh the session list to get updated data
      await dispatch(fetchChatSessions());

    } catch (error) {
      console.error('❌ Failed to toggle favorite:', error);
      // Close dropdown even if toggle fails
      setOpenDropdownId(null);
    }
  };

  const toggleDropdown = (sessionId: string, event: React.MouseEvent) => {
    // Prevent the event from bubbling up
    event.preventDefault();
    event.stopPropagation();

    const newValue = openDropdownId === sessionId ? null : sessionId;
    setOpenDropdownId(newValue);
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (openDropdownId) {
      const handleClickOutside = (event: MouseEvent) => {
        // Check if the click is on a dropdown button or inside a dropdown
        const target = event.target as Element;
        if (target && (
          target.closest('.session-menu-btn') ||
          target.closest('.dropdown-menu') ||
          target.closest('.position-relative')
        )) {
          return;
        }

        setOpenDropdownId(null);
      };

      // Add a small delay to prevent immediate closure
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openDropdownId]);

  return (
    <div className="sidebar-panel h-100 d-flex flex-column w-100">
      {/* Sidebar Header */}
      <div className="sidebar-header p-3 border-bottom">
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-chat-left-dots me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
          <h5 className="mb-0">Chat Sessions</h5>
        </div>

        {/* New Chat Button */}
        <div className="d-grid">
          <Button
            variant="primary"
            onClick={handleNewChat}
            className="new-chat-btn"
            disabled={isCreatingSession || showNewChatInput}
          >
            <i className="bi bi-plus-circle me-2"></i>
            New Chat
          </Button>
        </div>
      </div>

      {/* New Chat Input Field */}
      {showNewChatInput && (
        <div className="new-chat-input p-3 border-bottom bg-light">
          <Form.Label className="small text-muted mb-2">Session Title</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Enter chat title..."
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateSession();
                }
              }}
              disabled={isCreatingSession}
              autoFocus
            />
          </InputGroup>
          <div className="d-flex gap-2 mt-2">
            <Button
              className='w-50'
              variant="success"
              size="sm"
              onClick={handleCreateSession}
              disabled={!newChatTitle.trim() || isCreatingSession}
            >
              {isCreatingSession ? (
                <>
                  <div className="spinner-border spinner-border-sm me-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-check me-1"></i>
                  Create
                </>
              )}
            </Button>
            <Button
              className='w-50'
              variant="outline-secondary"
              size="sm"
              onClick={handleCancelNewChat}
              disabled={isCreatingSession}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Chat Sessions List */}
      <div className="chat-sessions flex-grow-1 overflow-auto">
        <div className="p-3">
          <h6 className="text-muted mb-3">Recent Chats</h6>
          {sessions.length === 0 ? (
            <div className="text-center text-muted py-4">
              <i className="bi bi-chat-dots mb-2" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
              <p className="small mb-0">No chat sessions yet</p>
              <p className="small">Start a new conversation above</p>
            </div>
          ) : (
            <Nav className="flex-column">
              {sessions.map((session) => {
                return (
                  <div key={session.id} className="mb-2">
                    <div
                      className={`chat-session-link ${currentSessionId === session.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (editingSessionId !== session.id) {
                          handleSessionSelect(session.id);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="session-title flex-grow-1">
                          <div className="d-flex align-items-center">

                            {session.favorite && (
                              <i className="bi bi-star-fill me-2 text-warning"></i>
                            )}
                            <div className="session-info">
                              {editingSessionId === session.id ? (
                                <div className="d-flex align-items-center gap-2">
                                  <Form.Control
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleSaveRename();
                                      } else if (e.key === 'Escape') {
                                        handleCancelRename();
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    size="sm"
                                    autoFocus
                                  />
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSaveRename();
                                    }}
                                  >
                                    <i className="bi bi-check"></i>
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelRename();
                                    }}
                                  >
                                    <i className="bi bi-x"></i>
                                  </Button>
                                </div>
                              ) : (
                                <div className="session-text">{session.title}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {editingSessionId !== session.id && (
                          <div className="position-relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn btn-sm btn-outline-secondary session-menu-btn"
                              onClick={(e) => {
                                console.log('Dropdown button clicked for session:', session.id);
                                toggleDropdown(session.id, e);
                              }}
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </button>

                            {openDropdownId === session.id && (
                              <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{ right: 0, top: '100%', minWidth: '180px' }}>
                                <button
                                  className="dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRenameSession(session.id, session.title);
                                    closeDropdown();
                                  }}
                                >
                                  <i className="bi bi-pencil me-2"></i>
                                  Rename
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(session.id, session.favorite || false);
                                  }}
                                >
                                  <i className={`bi ${session.favorite ? 'bi-star-fill text-warning' : 'bi-star'} me-2`}></i>
                                  {session.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                </button>
                                <hr className="dropdown-divider" />
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
                                    closeDropdown();
                                  }}
                                >
                                  <i className="bi bi-trash3 me-2"></i>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Nav>
          )}
        </div>
      </div>


    </div>
  );
};

export default Sidebar;
