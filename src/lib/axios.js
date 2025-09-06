import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Creates an instance of axios with a predefined configuration.
 * 
 * @constant {AxiosInstance} api - An axios instance configured with a base URL.
 * @property {string} baseURL - The base URL for the axios instance.
 */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

api.defaults.withCredentials = true;

api.interceptors.request.use((config) => {
  const token =Cookies.get('jwt') | localStorage.getItem('jwt') ;
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;