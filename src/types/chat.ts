export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string; // ISO string instead of Date
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentStreamingMessage: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages?: Message[];
  createdAt: string; // ISO string instead of Date
  updatedAt: string; // ISO string instead of Date
  favorite?: boolean; // Favorite status
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
