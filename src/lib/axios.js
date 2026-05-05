import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Creates an instance of axios with a predefined configuration.
 * 
 * @constant {AxiosInstance} api - An axios instance configured with a base URL.
 * @property {string} baseURL - The base URL for the API gateway.
 * @property {boolean} withCredentials - Send cookies with cross-domain requests.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.defaults.withCredentials = true;

// Flag to track if we're already refreshing token
let isRefreshing = false;
let failedQueue = [];

// Process failed requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

/**
 * Request interceptor — inject JWT token into every request
 */
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwt') || localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor — handle global errors and token refresh
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message || 'Erreur réseau';
    const originalRequest = error.config;

    // Handle 401 with token refresh attempt
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request if we're already refreshing
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Attempt to refresh token
      return new Promise((resolve, reject) => {
        const refreshToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token available, clear auth and redirect
          localStorage.removeItem('jwt');
          localStorage.removeItem('refreshToken');
          Cookies.remove('jwt');
          Cookies.remove('refreshToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          processQueue(error, null);
          reject(error);
          return;
        }

        // Call refresh endpoint (adjust based on your backend)
        api.post('/auth/refresh', { refreshToken })
          .then(({ data }) => {
            const { token, refreshToken: newRefreshToken } = data.payload || data;
            
            // Store new tokens
            Cookies.set('jwt', token, { expires: 7 });
            localStorage.setItem('jwt', token);
            if (newRefreshToken) {
              Cookies.set('refreshToken', newRefreshToken, { expires: 30 });
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            // Retry original request
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            processQueue(null, token);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            // Refresh failed, clear auth and redirect
            localStorage.removeItem('jwt');
            localStorage.removeItem('refreshToken');
            Cookies.remove('jwt');
            Cookies.remove('refreshToken');
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            processQueue(err, null);
            reject(err);
          });
      });
    }

    // Handle specific errors
    switch (status) {
      case 401:
        // Already handled by retry logic above
        break;
      case 423:
        // Account locked (5 failed login attempts)
        console.error('Compte temporairement verrouillé. Réessayez plus tard.');
        if (typeof window !== 'undefined') {
          // Could show a modal here
        }
        break;
      case 429:
        // Rate limit exceeded
        console.error('Trop de requêtes. Veuillez réessayer plus tard.');
        if (typeof window !== 'undefined') {
          // Could show a toast notification here
        }
        break;
      case 502:
        // Service unavailable
        console.error('Service temporairement indisponible. Réessayez.');
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default api;