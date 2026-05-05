import { createSlice } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import Cookies from "js-cookie";

const TOKEN_KEY = "jwt";

// État initial
const initialState = {
  items: [], // Array of shop IDs the user follows
  isLoading: false,
  error: null,
  successMessage: null,
};

export const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {
    followingRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    followingSuccess: (state, action) => {
      state.items = action.payload || [];
      state.isLoading = false;
      state.error = null;
    },
    followingToggled: (state, action) => {
      const shopId = action.payload;
      const index = state.items.indexOf(shopId);

      if (index > -1) {
        state.items.splice(index, 1);
        state.successMessage = "Boutique retirée de vos suivis";
      } else {
        state.items.push(shopId);
        state.successMessage = "Boutique ajoutée à vos suivis";
      }
      state.isLoading = false;
      state.error = null;
    },
    followingFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.successMessage = null;
    },
    clearFollowingMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
});

// Actions
export const {
  followingRequest,
  followingSuccess,
  followingToggled,
  followingFailure,
  clearFollowingMessage,
} = followingSlice.actions;

// Sélecteurs
export const followingSelectors = {
  selectFollowing: (state) => state.following?.items || [],
  selectIsLoading: (state) => state.following?.isLoading,
  selectError: (state) => state.following?.error,
  selectSuccessMessage: (state) => state.following?.successMessage,
  selectIsFollowing: (shopId) => (state) =>
    state.following?.items?.includes(shopId),
};

// Thunks asynchrones

/**
 * Fetch user following shops
 * GET /user/profile/:userId -> récupère profile avec following[]
 */
export const fetchUserFollowing = (userId) => async (dispatch) => {
  dispatch(followingRequest());
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.get(`/user/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const following = response.data.payload?.following || [];
    dispatch(followingSuccess(following));
    return following;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la récupération des boutiques suivies";
    dispatch(followingFailure(errorMessage));
    throw error;
  }
};

/**
 * Toggle following (add/remove shop)
 * POST /user/following
 */
export const toggleFollowing = (userId, shopId) => async (dispatch) => {
  dispatch(followingRequest());
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.post(
      "/user/following",
      { userId, shopId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const following = response.data.payload?.following || [];
    dispatch(followingSuccess(following));
    dispatch(followingToggled(shopId));
    return following;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la modification du suivi";
    dispatch(followingFailure(errorMessage));
    throw error;
  }
};

export default followingSlice;
