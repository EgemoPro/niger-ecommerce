import { createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import Cookies from 'js-cookie';

// Définition des constantes pour éviter les répétitions
const TOKEN_KEY = 'jwt';

// État initial
const initialState = {
  user: null,
  token: Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null,
  isAuthenticated: false,
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
    // Action unifiée pour toutes les authentifications réussies
    authSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = true;
    },
    
    // Alias pour compatibilité avec le middleware Socket
    loginSuccess: (state, action) => {
      // Réutiliser la logique d'authSuccess
      authSlice.caseReducers.authSuccess(state, action);
    },
    
    restoreAuth: (state, action) => {
      // Réutiliser la logique d'authSuccess
      authSlice.caseReducers.authSuccess(state, action);
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem(TOKEN_KEY);
      Cookies.remove(TOKEN_KEY);
      state.isLoading = false;
      state.user = null;
      state.token = null;
    },
  },
});

// Exportation des actions
export const { 
  authRequest, 
  authSuccess, 
  loginSuccess,
  restoreAuth,
  authFailure, 
  logout: authLogout 
} = authSlice.actions;

// Sélecteurs
export const authSelectors = {
  selectUser: (state) => state.auth.user,
  selectToken: (state) => state.auth.token,
  selectIsAuthenticated: (state) => state.auth.isAuthenticated,
  selectIsLoading: (state) => state.auth.isLoading,
  selectError: (state) => state.auth.error
};

// Fonction générique pour gérer les requêtes d'authentification
const handleAuthRequest = async (dispatch, endpoint, data, successAction) => {
  dispatch(authRequest());
  
  try {
    if(endpoint === 'auth/user/logout') {
      await api.get(endpoint, data);
      dispatch(authLogout());
      return true;
    }
    const response = await api.post(endpoint, data);
    console.log("auth response", response)
    const { token, ...user } = response.data;
    localStorage.setItem(TOKEN_KEY, token);
    Cookies.set(TOKEN_KEY, token)
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
  handleAuthRequest(dispatch, 'auth/user/login', credentials, authSuccess);

export const register = (userData) => (dispatch) =>
  handleAuthRequest(dispatch, 'auth/user/register', userData, authSuccess);

export const logout = () => (dispatch) =>
  handleAuthRequest(dispatch, 'auth/user/logout');

export const checkAuth = () => async (dispatch) => {
  dispatch(authRequest());
  const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  if (!token) {
    dispatch(authFailure('Pas de token trouvé.'));
    return false;
  }
  console.log(token)
  try {
    const response = await api.get('auth/user/profile', {
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
