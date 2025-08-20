import { ChatSession } from '@/types/chat';

// Session State Interface
export interface SessionState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  isCreatingSession: boolean;
  isDeletingSession: boolean;
  error: string | null;
}

// Session Action Types
export const SESSION_ACTIONS = {
  SET_CURRENT_SESSION: 'session/setCurrentSession',
  ADD_SESSION: 'session/addSession',
  REMOVE_SESSION: 'session/removeSession',
  SET_SESSIONS: 'session/setSessions',
  SET_LOADING: 'session/setLoading',
  SET_ERROR: 'session/setError',
  CLEAR_ERROR: 'session/clearError',
} as const;
