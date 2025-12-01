export const LOCALHOST = "https://pioneerpicks.net"
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: LOCALHOST,
  withCredentials: false,
});

api.interceptors.request.use(async (config) => {
  delete config.headers.Cookie;

  const sessionId = await SecureStore.getItemAsync("sessionId");
  if (sessionId) {
    config.headers.Cookie = `SESSION=${sessionId}`;
  }
  return config;
});

api.interceptors.response.use(
  async (response) => {

    const isLoginEndpoint = response.config.url?.includes('/auth/login');
    
    if (isLoginEndpoint) {
      const setCookieHeader = response.headers['set-cookie'] || response.headers['Set-Cookie'];
      
      if (setCookieHeader) {
        const cookieStr = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
        const sessionMatch = cookieStr?.match(/SESSION=([^;]+)/);
        
        if (sessionMatch) {
          const sessionId = sessionMatch[1];
          await SecureStore.setItemAsync("sessionId", sessionId);
          console.log("Session ID saved:", sessionId);
        }
      }
    }
    
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const status = error.response?.status;
      
      // Create a simple error object
      const cleanError = new Error(message);
      // Only attach simple, serializable properties
      if (status) {
        (cleanError as any).status = status;
      }
      
      return Promise.reject(cleanError);
    }
    
    // For non-axios errors, ensure it's a proper Error object
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

export default api;