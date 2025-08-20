import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ChatSession } from '@/types/chat';
import { sessionApi } from '@/services/api';

// Synchronous Session Action Creators
export const setCurrentSession = createAction<string>('session/setCurrentSession');
export const addSession = createAction<ChatSession>('session/addSession');
export const removeSession = createAction<string>('session/removeSession');
export const setSessions = createAction<ChatSession[]>('session/setSessions');
export const setSessionLoading = createAction<boolean>('session/setLoading');
export const setSessionError = createAction<string>('session/setError');
export const clearSessionError = createAction('session/clearError');

// Async Session Action Creators
export const createChatSession = createAsyncThunk(
  'session/createSession',
  async (title: string) => {
    try {
      const response = await sessionApi.createSession(title);
      if (response.success) {
        return {
          ...response.data,
          createdAt: response.data.createdAt || new Date().toISOString(),
          updatedAt: response.data.updatedAt || new Date().toISOString(),
        };
      } else {
        throw new Error(response.error || 'Failed to create session');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create session');
    }
  }
);

export const fetchChatSessions = createAsyncThunk(
  'session/fetchSessions',
  async () => {
    try {
      const response = await sessionApi.getSessions();
      if (response.success) {
        const sessions = response.data.map((session: any) => ({
          ...session,
          createdAt: session.createdAt || new Date().toISOString(),
          updatedAt: session.updatedAt || new Date().toISOString(),
        }));

        // Sort sessions by creation date (newest first)
        return sessions.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        throw new Error(response.error || 'Failed to fetch sessions');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch sessions');
    }
  }
);

export const deleteChatSession = createAsyncThunk(
  'session/deleteSession',
  async (sessionId: string) => {
    try {
      const response = await sessionApi.deleteSession(sessionId);
      if (response.success) {
        return sessionId;
      } else {
        throw new Error(response.error || 'Failed to delete session');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete session');
    }
  }
);

export const updateChatSession = createAsyncThunk(
  'session/updateSession',
  async ({ sessionId, updates }: { sessionId: string; updates: { title?: string } }) => {
    try {
      const response = await sessionApi.updateSession(sessionId, updates);
      if (response.success) {
        return {
          sessionId,
          ...response.data,
          updatedAt: new Date().toISOString(),
        };
      } else {
        throw new Error(response.error || 'Failed to update session');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update session');
    }
  }
);

export const toggleSessionFavorite = createAsyncThunk(
  'session/toggleFavorite',
  async (sessionId: string) => {
    try {
      const response = await sessionApi.toggleFavorite(sessionId);
      if (response.success) {
        return {
          sessionId,
          ...response.data,
          updatedAt: new Date().toISOString(),
        };
      } else {
        throw new Error(response.error || 'Failed to toggle favorite');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to toggle favorite');
    }
  }
);

export const renameSession = createAsyncThunk(
  'session/renameSession',
  async ({ sessionId, title }: { sessionId: string; title: string }) => {
    try {
      const response = await sessionApi.renameSession(sessionId, title);
      if (response.success) {
        return {
          sessionId,
          ...response.data,
          updatedAt: new Date().toISOString(),
        };
      } else {
        throw new Error(response.error || 'Failed to rename session');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to rename session');
    }
  }
);
