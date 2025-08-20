import { ApiResponse } from '@/types/chat';
import { apiClient, getApiBaseUrl, getApiKey } from './interceptors';

export const chatApi = {
  /**
   * Send a regular message to the chat
   * @param message - The message content to send
   * @param sessionId - Session ID to associate with the message
   * @returns Promise<ApiResponse> - API response with assistant's reply
   */
  sendMessage: async (message: string, sessionId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post(`/api/v1/messages/${sessionId}`, {
        role: 'user',
        content: message,
        metadata: {}
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Send a streaming message to the chat
   * @param message - The message content to send
   * @param onChunk - Callback function to handle streaming chunks
   * @param sessionId - Optional session ID to associate with the message
   * @returns Promise<void> - Resolves when streaming is complete
   */
  sendStreamingMessage: async (
    message: string,
    onChunk: (chunk: string) => void,
    sessionId?: string
  ): Promise<void> => {
    try {
      const API_BASE_URL = getApiBaseUrl();
      const API_KEY = getApiKey();

      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || process.env.NEXT_PUBLIC_AUTH_TOKEN || ''}`,
          ...(API_KEY && { 'X-API-Key': API_KEY }),
        },
        body: JSON.stringify({
          message,
          sessionId,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Streaming failed');
    }
  },

  /**
   * Get chat history for a session
   * @param sessionId - Optional session ID to get history for
   * @returns Promise<ApiResponse> - API response with chat history
   */
  getChatHistory: async (sessionId?: string): Promise<ApiResponse> => {
    try {
      const url = sessionId ? `/chat/history/${sessionId}` : '/chat/history';
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Get messages for a specific session
   * @param sessionId - The ID of the session to get messages for
   * @returns Promise<ApiResponse> - API response with messages
   */
  getSessionMessages: async (sessionId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/api/v1/messages/${sessionId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Clear chat history for a session
   * @param sessionId - Optional session ID to clear history for
   * @returns Promise<ApiResponse> - API response confirming clear operation
   */
  clearChatHistory: async (sessionId?: string): Promise<ApiResponse> => {
    try {
      const url = sessionId ? `/chat/history/${sessionId}` : '/chat/history';
      const response = await apiClient.delete(url);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Get available chat models
   * @returns Promise<ApiResponse> - API response with available models
   */
  getModels: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get('/chat/models');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Set the chat model for a session
   * @param model - The model name to use
   * @param sessionId - Optional session ID
   * @returns Promise<ApiResponse> - API response confirming model change
   */
  setModel: async (model: string, sessionId?: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post('/chat/model', {
        model,
        sessionId,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default chatApi;
