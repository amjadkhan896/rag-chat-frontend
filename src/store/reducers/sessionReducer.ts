import { createReducer } from '@reduxjs/toolkit';
import { SessionState } from '../types/sessionTypes';
import {
  setCurrentSession,
  addSession,
  removeSession,
  setSessions,
  setSessionLoading,
  setSessionError,
  clearSessionError,
  createChatSession,
  fetchChatSessions,
  deleteChatSession,
  updateChatSession,
  toggleSessionFavorite,
  renameSession,
} from '../actions/sessionActions';

const initialState: SessionState = {
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  isCreatingSession: false,
  isDeletingSession: false,
  error: null,
};

const sessionReducer = createReducer(initialState, (builder) => {
  builder
    // Synchronous actions
    .addCase(setCurrentSession, (state, action) => {
      state.currentSessionId = action.payload;
    })
    .addCase(addSession, (state, action) => {
      state.sessions.unshift(action.payload); // Add to beginning (newest first)
    })
    .addCase(removeSession, (state, action) => {
      state.sessions = state.sessions.filter(session => session.id !== action.payload);
      // If we're removing the current session, clear it
      if (state.currentSessionId === action.payload) {
        state.currentSessionId = null;
      }
    })
    .addCase(setSessions, (state, action) => {
      state.sessions = action.payload;
    })
    .addCase(setSessionLoading, (state, action) => {
      state.isLoading = action.payload;
    })
    .addCase(setSessionError, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isCreatingSession = false;
      state.isDeletingSession = false;
    })
    .addCase(clearSessionError, (state) => {
      state.error = null;
    })

    // Async actions - Create Session
    .addCase(createChatSession.pending, (state) => {
      state.isCreatingSession = true;
      state.error = null;
    })
    .addCase(createChatSession.fulfilled, (state, action) => {
      state.isCreatingSession = false;
      state.sessions.unshift(action.payload); // Add to beginning (newest first)
      state.currentSessionId = action.payload.id;
    })
    .addCase(createChatSession.rejected, (state, action) => {
      state.isCreatingSession = false;
      state.error = action.error.message || 'Failed to create session';
    })

    // Async actions - Fetch Sessions
    .addCase(fetchChatSessions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchChatSessions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sessions = action.payload;
    })
    .addCase(fetchChatSessions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch sessions';
    })

    // Async actions - Delete Session
    .addCase(deleteChatSession.pending, (state) => {
      state.isDeletingSession = true;
      state.error = null;
    })
    .addCase(deleteChatSession.fulfilled, (state, action) => {
      state.isDeletingSession = false;
      state.sessions = state.sessions.filter(session => session.id !== action.payload);
      // If we're deleting the current session, clear it
      if (state.currentSessionId === action.payload) {
        state.currentSessionId = null;
      }
    })
    .addCase(deleteChatSession.rejected, (state, action) => {
      state.isDeletingSession = false;
      state.error = action.error.message || 'Failed to delete session';
    })

    // Async actions - Update Session
    .addCase(updateChatSession.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateChatSession.fulfilled, (state, action) => {
      state.isLoading = false;
      const sessionIndex = state.sessions.findIndex(session => session.id === action.payload.sessionId);
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = { ...state.sessions[sessionIndex], ...action.payload };
      }
    })
    .addCase(updateChatSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to update session';
    })

    // Async actions - Toggle Favorite
    .addCase(toggleSessionFavorite.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(toggleSessionFavorite.fulfilled, (state, action) => {
      state.isLoading = false;
      const sessionIndex = state.sessions.findIndex(session => session.id === action.payload.sessionId);
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = { ...state.sessions[sessionIndex], ...action.payload };
      }
    })
    .addCase(toggleSessionFavorite.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to toggle favorite';
    })

    // Async actions - Rename Session
    .addCase(renameSession.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(renameSession.fulfilled, (state, action) => {
      state.isLoading = false;
      const sessionIndex = state.sessions.findIndex(session => session.id === action.payload.sessionId);
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = { ...state.sessions[sessionIndex], ...action.payload };
      }
    })
    .addCase(renameSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to rename session';
    });
});

export default sessionReducer;
