import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Creates an instance of axios with a predefined configuration.
 * 
 * @constant {AxiosInstance} api - An axios instance configured with a base URL.
 * @property {string} baseURL - The base URL for the axios instance.
 */
const api = axios.create({
  baseURL: 'http://localhost:8000/'
});
api.defaults.withCredentials = true;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt') || Cookies.get('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;