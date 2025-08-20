// Export interceptors and base client
export { apiClient, getApiBaseUrl, getApiKey } from './interceptors';

// Export individual API modules
export { sessionApi } from './sessionApi';
export { chatApi } from './chatApi';

// Export default APIs for backward compatibility
export { default as sessionAPI } from './sessionApi';
export { default as chatAPI } from './chatApi';

// Import APIs for legacy export
import { sessionApi } from './sessionApi';
import { chatApi } from './chatApi';

// Legacy export for backward compatibility
export const chatAPI_legacy = {
  // Session methods
  createChatSession: sessionApi.createSession,
  getChatSessions: sessionApi.getSessions,
  deleteChatSession: sessionApi.deleteSession,

  // Chat methods
  sendMessage: chatApi.sendMessage,
  sendStreamingMessage: chatApi.sendStreamingMessage,
  getChatHistory: chatApi.getChatHistory,
};

// Default export for main API client
export { default } from './interceptors';
