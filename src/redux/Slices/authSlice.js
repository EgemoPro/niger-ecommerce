import { createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import Cookies from 'js-cookie';

// Définition des constantes pour éviter les répétitions
const TOKEN_KEY = 'jwt';

// État initial
const initialState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY) || null,
  isLoading: false,
  error: null,
};

// Création du slice Redux
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoading = false;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem(TOKEN_KEY);
      state.isLoading = false;
      state.user = null;
      state.token = null;
    },
  },
});

// Exportation des actions
export const { authRequest, authSuccess, authFailure, logout:authLogout } = authSlice.actions;

// Fonction générique pour gérer les requêtes d'authentification
const handleAuthRequest = async (dispatch, endpoint, data, successAction) => {
  dispatch(authRequest());
  
  try {
    if(endpoint === 'user/logout') {
      dispatch(authLogout());
      return true;
    }
    const response = await api.post(endpoint, data);
    console.log("auth response", response)
    const { token, ...user } = response.data;
    localStorage.setItem(TOKEN_KEY, token);
    dispatch(successAction({ user, token }));
    return true;
  } catch (error) {
    console.log("auth error", error.response.data)
    const errorMessage = error.response?.data?.error || 'Une erreur est survenue.';
    dispatch(authFailure(errorMessage));
    return false;
  }
};

// Actions asynchrones
// credenntial: {email,password}
export const login = (credentials) => (dispatch) =>
  handleAuthRequest(dispatch, 'user/login', credentials, authSuccess);

export const register = (userData) => (dispatch) =>
  handleAuthRequest(dispatch, 'user/register', userData, authSuccess);

export const logout = () => (dispatch) =>
  handleAuthRequest(dispatch, 'user/logout');

export const checkAuth = () => async (dispatch) => {
  dispatch(authRequest());
  const token = localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY);
  if (!token) {
    dispatch(authFailure('Pas de token trouvé.'));
    return false;
  }

  try {
    const response = await api.get('user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(authSuccess({ user: response.data, token }));
    return true;
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);
    dispatch(authFailure('Erreur lors de la vérification de l\'authentification.'));
    return false;
  }
};

export default authSlice;
