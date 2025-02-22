import { createSlice } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import Cookies from "js-cookies";

const TOKEN_KEY = "jwt";

// État initial
const initialState = {
  favorites: [],
  following: [],
  orders: [],
  notifications: [],
  cart: [],
  isLoading: false,
  error: null,
};

// Fonction générique pour requêtes API
const handleRequest = async (
  dispatch,
  action,
  endpoint,
  method = "GET",
  data = null
) => {
  dispatch(requestStart());
  try {
    const response =
      method === "GET"
        ? await api.get(endpoint, {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem(TOKEN_KEY) || Cookies.getItem(TOKEN_KEY)
              }`,
            },
          })
        : await api({
            method,
            url: endpoint,
            data,
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem(TOKEN_KEY) || Cookies.getItem(TOKEN_KEY)
              }`,
            },
          });

    dispatch(action(response.data));
    dispatch(requestSuccess());
  } catch (error) {
    const message = error.response?.data?.error || "Erreur serveur.";
    dispatch(requestFail(message));
    console.error(message);
  }
};

// Création du slice Redux
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Gestion des requêtes API
    requestStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    requestSuccess: (state) => {
      state.isLoading = false;
    },
    requestFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Mise à jour des états
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },

    // Gestion des favoris
    toggleFavorite: (state, action) => {
      const index = state.favorites.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index > -1) state.favorites.splice(index, 1);
      else state.favorites.push(action.payload);
    },

    // Gestion du panier
    updateCartItem: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
      else state.cart.push(action.payload);
    },
    removeCartItem: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

// Exportation des actions
export const {
  requestStart,
  requestSuccess,
  requestFail,
  setFavorites,
  setFollowing,
  setOrders,
  setNotifications,
  setCart,
  toggleFavorite,
  updateCartItem,
  removeCartItem,
  clearCart,
} = userSlice.actions;

// Actions asynchrones
export const fetchFavorites = () => async (dispatch) =>
  handleRequest(dispatch, setFavorites, "user/favorites");
export const fetchFollowing = () => async (dispatch) =>
  handleRequest(dispatch, setFollowing, "user/following");
export const fetchOrders = () => async (dispatch) =>
  handleRequest(dispatch, setOrders, "user/orders");

export const toggleFavoriteAsync =
  (productId, userId) => async (dispatch, getState) => {
    console.log(dispatch, getState);
    const isFavorite = getState().user.favorites.some(
      (fav) => fav.id === productId
    );
    const method = isFavorite ? "DELETE" : "POST";
    await handleRequest(dispatch, toggleFavorite, "user/favorites", method, {
      productId,
      userId,
    });
  };

export const updateCartAsync = (cartItem) => async (dispatch) => {
  await handleRequest(dispatch, updateCartItem, "user/cart", "POST", cartItem);
};

export const removeCartItemAsync = (itemId) => async (dispatch) => {
  await handleRequest(
    dispatch,
    removeCartItem,
    `user/cart/${itemId}`,
    "DELETE"
  );
};

export const createOrderAsync = (orderData) => async (dispatch) => {
  await handleRequest(dispatch, setOrders, "user/orders", "POST", orderData);
  dispatch(clearCart());
};

export default userSlice;
