import axios, { AxiosInstance } from 'axios';

// Configure the base URL for your RAG chat backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_KEY = process.env.NEXT_PUBLIC_X_API_KEY || process.env.NEXT_PUBLIC_API_KEY || '0dabf354ce8f4f10bef0903494a42d97';

// Create the main API client
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-Key': API_KEY }),
  },
});

// Request interceptor for adding auth tokens and API key
apiClient.interceptors.request.use(
  (config) => {
    // Ensure X-API-Key is always present
    const apiKey = API_KEY;
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken') || process.env.NEXT_PUBLIC_AUTH_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // You can add redirect logic here if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to get API base URL
export const getApiBaseUrl = (): string => API_BASE_URL;

// Helper function to get API key
export const getApiKey = (): string | undefined => API_KEY;

export default apiClient;
