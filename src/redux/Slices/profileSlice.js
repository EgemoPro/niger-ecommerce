import { createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'jwt';

// État initial
const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

// Création du slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    profileSuccess: (state, action) => {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    profileUpdated: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.isLoading = false;
      state.successMessage = action.payload.message || 'Profil mis à jour avec succès';
      state.error = null;
    },
    profileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.successMessage = null;
    },
    clearProfileMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
    resetProfile: (state) => {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
});

// Actions
export const {
  profileRequest,
  profileSuccess,
  profileUpdated,
  profileFailure,
  clearProfileMessage,
  resetProfile,
} = profileSlice.actions;

// Sélecteurs
export const profileSelectors = {
  selectProfile: (state) => state.profile?.profile,
  selectIsLoading: (state) => state.profile?.isLoading,
  selectError: (state) => state.profile?.error,
  selectSuccessMessage: (state) => state.profile?.successMessage,
};

// Thunks asynchrones

/**
 * Fetch user profile by ID
 * GET /user/profile/:userId
 */
export const fetchUserProfile = (userId) => async (dispatch) => {
  dispatch(profileRequest());
  
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.get(`/user/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const profile = response.data.payload || response.data;
    dispatch(profileSuccess(profile));
    return profile;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération du profil';
    dispatch(profileFailure(errorMessage));
    throw error;
  }
};

/**
 * Update user profile
 * PUT /user/profile/:userId
 */
export const updateUserProfile = (userId, profileData) => async (dispatch) => {
  dispatch(profileRequest());
  
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    
    // If avatar is a File object, use FormData
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    
    let data = profileData;
    
    if (profileData.avatar instanceof File) {
      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        if (key === 'avatar') {
          formData.append(key, profileData.avatar);
        } else if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });
      data = formData;
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    const response = await api.put(`/user/profile/${userId}`, data, config);
    
    const updatedProfile = response.data.payload || response.data;
    dispatch(profileUpdated({ 
      ...updatedProfile, 
      message: 'Profil mis à jour avec succès' 
    }));
    
    return updatedProfile;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du profil';
    dispatch(profileFailure(errorMessage));
    throw error;
  }
};

/**
 * Update user password
 * PATCH /auth/user/password (if available)
 * Or custom endpoint for password change
 */
export const updateUserPassword = (userId, { currentPassword, newPassword }) => async (dispatch) => {
  dispatch(profileRequest());
  
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    
    // Try auth endpoint first (more standard)
    const response = await api.patch('/auth/user/password', {
      currentPassword,
      newPassword,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    dispatch(profileUpdated({ message: 'Mot de passe mis à jour avec succès' }));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du mot de passe';
    dispatch(profileFailure(errorMessage));
    throw error;
  }
};

export default profileSlice;
