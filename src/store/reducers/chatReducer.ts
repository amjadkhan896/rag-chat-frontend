import { createReducer } from '@reduxjs/toolkit';
import { ChatState } from '@/types/chat';
import {
  addMessage,
  clearMessages,
  startStreaming,
  updateStreamingMessage,
  finishStreaming,
  setLoading,
  setError,
  clearError,
  sendMessage,
  sendStreamingMessage,
  loadSessionMessages,
} from '../actions/chatActions';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  currentStreamingMessage: '',
};

const chatReducer = createReducer(initialState, (builder) => {
  builder
    // Synchronous actions
    .addCase(addMessage, (state, action) => {
      state.messages.push(action.payload);
    })
    .addCase(clearMessages, (state) => {
      state.messages = [];
      state.error = null;
    })
    .addCase(startStreaming, (state, action) => {
      const streamingMessage = {
        id: action.payload,
        content: '',
        role: 'assistant' as const,
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };
      state.messages.push(streamingMessage);
      state.currentStreamingMessage = '';
    })
    .addCase(updateStreamingMessage, (state, action) => {
      state.currentStreamingMessage += action.payload;
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.isStreaming) {
        lastMessage.content = state.currentStreamingMessage;
      }
    })
    .addCase(finishStreaming, (state) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.isStreaming) {
        lastMessage.isStreaming = false;
      }
      state.currentStreamingMessage = '';
    })
    .addCase(setLoading, (state, action) => {
      state.isLoading = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    })
    .addCase(clearError, (state) => {
      state.error = null;
    })
    // Async actions
    .addCase(sendMessage.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(sendMessage.fulfilled, (state, action) => {
      state.isLoading = false;
      // Messages are reloaded by the action, so we don't need to add anything here
    })
    .addCase(sendMessage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to send message';
    })
    .addCase(sendStreamingMessage.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(sendStreamingMessage.fulfilled, (state) => {
      state.isLoading = false;
    })
    .addCase(sendStreamingMessage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to send streaming message';
    })

    // Load Session Messages
    .addCase(loadSessionMessages.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loadSessionMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages = action.payload;
    })
    .addCase(loadSessionMessages.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to load session messages';
    });
});

export default chatReducer;
