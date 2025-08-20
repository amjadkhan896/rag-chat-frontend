import { ApiResponse } from '@/types/chat';
import { apiClient } from './interceptors';

export const sessionApi = {
  /**
   * Create a new chat session
   * @param title - The title for the new session
   * @returns Promise<ApiResponse> - API response with session data
   */
  createSession: async (title: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post('/api/v1/sessions', {
        title,
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
   * Get all chat sessions for the current user
   * @returns Promise<ApiResponse> - API response with sessions list
   */
  getSessions: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get('/api/v1/sessions');
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
   * Delete a chat session by ID
   * @param sessionId - The ID of the session to delete
   * @returns Promise<ApiResponse> - API response confirming deletion
   */
  deleteSession: async (sessionId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete(`/api/v1/sessions/${sessionId}`);
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
   * Update a chat session (generic updates)
   * @param sessionId - The ID of the session to update
   * @param updates - The fields to update
   * @returns Promise<ApiResponse> - API response with updated session data
   */
  updateSession: async (sessionId: string, updates: { title?: string }): Promise<ApiResponse> => {
    try {
      const response = await apiClient.put(`/api/v1/sessions/${sessionId}`, updates);
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
   * Rename a chat session
   * @param sessionId - The ID of the session to rename
   * @param title - The new title for the session
   * @returns Promise<ApiResponse> - API response with updated session data
   */
  renameSession: async (sessionId: string, title: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.patch(`/api/v1/sessions/${sessionId}/rename`, { title });
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
   * Toggle favorite status of a chat session
   * @param sessionId - The ID of the session to toggle favorite
   * @returns Promise<ApiResponse> - API response with updated session data
   */
  toggleFavorite: async (sessionId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.patch(`/api/v1/sessions/${sessionId}/favorite`);
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
   * Get a specific session by ID
   * @param sessionId - The ID of the session to retrieve
   * @returns Promise<ApiResponse> - API response with session data
   */
  getSession: async (sessionId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/api/v1/sessions/${sessionId}`);
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

export default sessionApi;
