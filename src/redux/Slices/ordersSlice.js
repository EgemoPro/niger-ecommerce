import { createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'jwt';

// État initial
const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  successMessage: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

// Création du slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    ordersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    ordersSuccess: (state, action) => {
      state.orders = action.payload.orders || [];
      state.pagination = action.payload.pagination || state.pagination;
      state.isLoading = false;
      state.error = null;
    },
    orderDetailSuccess: (state, action) => {
      state.currentOrder = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    orderCreated: (state, action) => {
      state.currentOrder = action.payload;
      state.orders.unshift(action.payload);
      state.isLoading = false;
      state.successMessage = 'Commande créée avec succès';
      state.error = null;
    },
    orderStatusUpdated: (state, action) => {
      if (state.currentOrder) {
        state.currentOrder = { ...state.currentOrder, ...action.payload };
      }
      const orderIndex = state.orders.findIndex(o => o._id === action.payload._id);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = { ...state.orders[orderIndex], ...action.payload };
      }
      state.isLoading = false;
      state.successMessage = 'Statut de commande mis à jour';
      state.error = null;
    },
    orderCancelled: (state, action) => {
      if (state.currentOrder?._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
      const orderIndex = state.orders.findIndex(o => o._id === action.payload._id);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = action.payload;
      }
      state.isLoading = false;
      state.successMessage = 'Commande annulée';
      state.error = null;
    },
    ordersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.successMessage = null;
    },
    clearOrderMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
});

// Actions
export const {
  ordersRequest,
  ordersSuccess,
  orderDetailSuccess,
  orderCreated,
  orderStatusUpdated,
  orderCancelled,
  ordersFailure,
  clearOrderMessage,
  resetOrders,
} = ordersSlice.actions;

// Sélecteurs
export const ordersSelectors = {
  selectOrders: (state) => state.orders?.orders,
  selectCurrentOrder: (state) => state.orders?.currentOrder,
  selectIsLoading: (state) => state.orders?.isLoading,
  selectError: (state) => state.orders?.error,
  selectSuccessMessage: (state) => state.orders?.successMessage,
  selectPagination: (state) => state.orders?.pagination,
};

// Thunks asynchrones

/**
 * Fetch user orders with pagination
 * GET /orders?page=1&limit=10
 */
export const fetchUserOrders = (page = 1, limit = 10) => async (dispatch) => {
  dispatch(ordersRequest());
  
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.get(`/orders?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const { orders, pagination } = response.data.payload;
    dispatch(ordersSuccess({ orders, pagination }));
    return { orders, pagination };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération des commandes';
    dispatch(ordersFailure(errorMessage));
    throw error;
  }
};

/**
 * Fetch order details by ID
 * GET /orders/:id
 */
export const fetchOrderDetail = (orderId) => async (dispatch) => {
  dispatch(ordersRequest());
  
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const order = response.data.payload || response.data;
    dispatch(orderDetailSuccess(order));
    return order;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération de la commande';
    dispatch(ordersFailure(errorMessage));
    throw error;
  }
};

/**
 * Create a new order
 * POST /orders
 */
export const createOrder = (orderData) => async (dispatch) => {
  dispatch(ordersRequest());
  
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.post('/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const order = response.data.payload || response.data;
    dispatch(orderCreated(order));
    return order;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la création de la commande';
    dispatch(ordersFailure(errorMessage));
    throw error;
  }
};

/**
 * Cancel order (only if status is 'pending')
 * PATCH /orders/:id/status with status='cancelled'
 */
export const cancelOrder = (orderId) => async (dispatch) => {
  dispatch(ordersRequest());
  
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.patch(
      `/orders/${orderId}/status`,
      { status: 'cancelled', note: 'Annulation demandée par le client' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const order = response.data.payload || response.data;
    dispatch(orderCancelled(order));
    return order;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de l\'annulation de la commande';
    dispatch(ordersFailure(errorMessage));
    throw error;
  }
};

/**
 * Confirm payment
 * PATCH /orders/:id/payment
 */
export const confirmPayment = (orderId, paymentIntentId = '') => async (dispatch) => {
  dispatch(ordersRequest());
  
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.patch(
      `/orders/${orderId}/payment`,
      { paymentIntentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const order = response.data.payload || response.data;
    dispatch(orderDetailSuccess(order));
    dispatch(clearOrderMessage());
    return order;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la confirmation du paiement';
    dispatch(ordersFailure(errorMessage));
    throw error;
  }
};

export default ordersSlice;
