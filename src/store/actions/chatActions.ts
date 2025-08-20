import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Message } from '@/types/chat';
import { chatApi } from '@/services/api';

// Synchronous Action Creators using createAction
export const addMessage = createAction<Message>('chat/addMessage');
export const clearMessages = createAction('chat/clearMessages');
export const startStreaming = createAction<string>('chat/startStreaming');
export const updateStreamingMessage = createAction<string>('chat/updateStreamingMessage');
export const finishStreaming = createAction('chat/finishStreaming');
export const setLoading = createAction<boolean>('chat/setLoading');
export const setError = createAction<string>('chat/setError');
export const clearError = createAction('chat/clearError');

// Async Action Creators using createAsyncThunk
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, sessionId }: { message: string; sessionId: string }, { dispatch }) => {
    try {
      // Send message to API
      const response = await chatApi.sendMessage(message, sessionId);

      if (response.success) {
        // Reload messages to get the complete conversation including the response
        await dispatch(loadSessionMessages(sessionId)).unwrap();
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      throw new Error(error.message || 'Failed to send message');
    }
  }
);

export const sendStreamingMessage = createAsyncThunk(
  'chat/sendStreamingMessage',
  async (message: string, { dispatch }) => {
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage(userMessage));

      const assistantMessageId = (Date.now() + 1).toString();
      dispatch(startStreaming(assistantMessageId));

      await chatApi.sendStreamingMessage(message, (chunk: string) => {
        dispatch(updateStreamingMessage(chunk));
      });

      dispatch(finishStreaming());
      return assistantMessageId;
    } catch (error: any) {
      dispatch(finishStreaming());
      throw new Error(error.message || 'Failed to send streaming message');
    }
  }
);

export const loadSessionMessages = createAsyncThunk(
  'chat/loadSessionMessages',
  async (sessionId: string) => {
    try {
      const response = await chatApi.getSessionMessages(sessionId);
      if (response.success) {
        // Transform the API response to match our Message interface
        const messages = Array.isArray(response.data) ? response.data : response.data.messages || [];
        return messages.map((msg: any) => ({
          id: msg.id || Date.now().toString(),
          content: msg.content || msg.message || '',
          role: msg.role || (msg.sender === 'user' ? 'user' : 'assistant'),
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
        }));
      } else {
        throw new Error(response.error || 'Failed to load messages');
      }
    } catch (error: any) {
      console.error('Failed to load session messages:', error);
      throw new Error(error.message || 'Failed to load session messages');
    }
  }
);
