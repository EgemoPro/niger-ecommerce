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
 * Response interceptor — handle global errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message || 'Erreur réseau';

    // Handle specific errors
    switch (status) {
      case 401:
        // Token expired or invalid
        localStorage.removeItem('jwt');
        Cookies.remove('jwt');
        // Could trigger auth slice action here if needed
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        break;
      case 423:
        // Account locked (5 failed login attempts)
        console.error('Compte temporairement verrouillé. Réessayez plus tard.');
        break;
      case 429:
        // Rate limit exceeded
        console.error('Trop de requêtes. Veuillez réessayer plus tard.');
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