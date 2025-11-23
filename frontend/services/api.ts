export const LOCALHOST = "https://pioneerpicks.net"
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: LOCALHOST,
  withCredentials: false,
});

// Request interceptor - add session cookie
api.interceptors.request.use(async (config) => {
  delete config.headers.Cookie;

  const sessionId = await SecureStore.getItemAsync("sessionId");
  if (sessionId) {
    config.headers.Cookie = `SESSION=${sessionId}`;
  }
  return config;
});

// Response interceptor - save session ID
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
    return Promise.reject(error);
  }
);

export default api;