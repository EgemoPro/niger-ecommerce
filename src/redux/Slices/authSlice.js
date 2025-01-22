import { createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
    },
    checkAuthStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    checkAuthSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    checkAuthFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  checkAuthStart,
  checkAuthSuccess,
  checkAuthFailure,
} = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await api.post('user/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    dispatch(loginSuccess({ user, token }));
    return true;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur de connexion';
    dispatch(loginFailure(errorMessage));
    return false;
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch(registerStart());
  try {
    const response = await api.post('user/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    dispatch(registerSuccess({ user, token }));
    return true;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Erreur d\'inscription';
    dispatch(registerFailure(errorMessage));
    return false;
  }
};

export const checkAuth = () => async (dispatch) => {
  dispatch(checkAuthStart());
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(checkAuthFailure('Pas de token trouvé.'));
    return false;
  }

  try {
    const response = await api.get('user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(checkAuthSuccess(response.data));
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    dispatch(checkAuthFailure('Erreur lors de la vérification de l\'authentification.'));
    return false;
  }
};

export default authSlice;
