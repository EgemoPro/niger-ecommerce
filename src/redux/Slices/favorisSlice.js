import { createSlice } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import Cookies from "js-cookie";

const TOKEN_KEY = "jwt";

// État initial
const initialState = {
  items: [], // IDs des produits favoris
  isLoading: false,
  error: null,
  successMessage: null,
};

export const favorisSlice = createSlice({
  name: "favoris",
  initialState,
  reducers: {
    favorisRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    favorisSuccess: (state, action) => {
      state.items = action.payload || [];
      state.isLoading = false;
      state.error = null;
    },
    favorisToggled: (state, action) => {
      const productId = action.payload;
      const index = state.items.indexOf(productId);
      
      if (index > -1) {
        state.items.splice(index, 1);
        state.successMessage = "Produit retiré des favoris";
      } else {
        state.items.push(productId);
        state.successMessage = "Produit ajouté aux favoris";
      }
      state.isLoading = false;
      state.error = null;
    },
    favorisFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.successMessage = null;
    },
    clearFavorisMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
});

// Actions
export const {
  favorisRequest,
  favorisSuccess,
  favorisToggled,
  favorisFailure,
  clearFavorisMessage,
} = favorisSlice.actions;

// Sélecteurs
export const favorisSelectors = {
  selectFavorites: (state) => state.favoris?.items || [],
  selectIsLoading: (state) => state.favoris?.isLoading,
  selectError: (state) => state.favoris?.error,
  selectSuccessMessage: (state) => state.favoris?.successMessage,
  selectIsFavorite: (productId) => (state) =>
    state.favoris?.items?.includes(productId),
};

// Thunks asynchrones

/**
 * Fetch user favorites
 * GET /user/profile/:userId -> récupère profile avec favorites[]
 */
export const fetchUserFavorites = (userId) => async (dispatch) => {
  dispatch(favorisRequest());
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.get(`/user/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const favorites = response.data.payload?.favorites || [];
    dispatch(favorisSuccess(favorites));
    return favorites;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la récupération des favoris";
    dispatch(favorisFailure(errorMessage));
    throw error;
  }
};

/**
 * Toggle favorite (add/remove)
 * POST /user/favorites
 */
export const toggleFavorite = (userId, productId) => async (dispatch) => {
  dispatch(favorisRequest());
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.post(
      "/user/favorites",
      { userId, productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const favorites = response.data.payload?.favorites || [];
    dispatch(favorisSuccess(favorites));
    dispatch(favorisToggled(productId));
    return favorites;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la modification des favoris";
    dispatch(favorisFailure(errorMessage));
    throw error;
  }
};

export default favorisSlice;
