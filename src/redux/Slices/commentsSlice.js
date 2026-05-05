import { createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'jwt';

// État initial
const initialState = {
  comments: [],
  currentProductComments: [],
  isLoading: false,
  error: null,
  successMessage: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
};

// Création du slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    commentsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    commentsSuccess: (state, action) => {
      state.currentProductComments = action.payload.comments || [];
      state.pagination = action.payload.pagination || state.pagination;
      state.isLoading = false;
      state.error = null;
    },
    commentAdded: (state, action) => {
      state.currentProductComments = [action.payload, ...state.currentProductComments];
      state.isLoading = false;
      state.successMessage = 'Commentaire ajouté avec succès';
      state.error = null;
    },
    commentDeleted: (state, action) => {
      state.currentProductComments = state.currentProductComments.filter(
        (c) => c._id !== action.payload
      );
      state.isLoading = false;
      state.successMessage = 'Commentaire supprimé avec succès';
      state.error = null;
    },
    commentsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.successMessage = null;
    },
    clearCommentMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
    resetComments: (state) => {
      state.comments = [];
      state.currentProductComments = [];
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
});

// Actions
export const {
  commentsRequest,
  commentsSuccess,
  commentAdded,
  commentDeleted,
  commentsFailure,
  clearCommentMessage,
  resetComments,
} = commentsSlice.actions;

// Sélecteurs
export const commentsSelectors = {
  selectCurrentProductComments: (state) => state.comments?.currentProductComments || [],
  selectIsLoading: (state) => state.comments?.isLoading,
  selectError: (state) => state.comments?.error,
  selectSuccessMessage: (state) => state.comments?.successMessage,
  selectPagination: (state) => state.comments?.pagination,
};

// Thunks asynchrones

export const fetchProductComments = (productId, page = 1, limit = 20) => async (dispatch) => {
  dispatch(commentsRequest());
  try {
    const response = await api.get(`/comments/${productId}?page=${page}&limit=${limit}`);
    const comments = Array.isArray(response.data.payload)
      ? response.data.payload
      : response.data.payload?.comments || [];
    const pagination = response.data.payload?.pagination || {
      total: comments.length,
      page: 1,
      limit,
      totalPages: Math.ceil(comments.length / limit),
    };
    dispatch(commentsSuccess({ comments, pagination }));
    return { comments, pagination };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération des commentaires';
    dispatch(commentsFailure(errorMessage));
    throw error;
  }
};

export const addProductComment = (commentData) => async (dispatch) => {
  dispatch(commentsRequest());
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.post('/comments/new', commentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const comment = response.data.payload || response.data;
    dispatch(commentAdded(comment));
    return comment;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de l\'ajout du commentaire';
    dispatch(commentsFailure(errorMessage));
    throw error;
  }
};

export const deleteProductComment = (commentId) => async (dispatch) => {
  dispatch(commentsRequest());
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    await api.delete(`/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(commentDeleted(commentId));
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la suppression du commentaire';
    dispatch(commentsFailure(errorMessage));
    throw error;
  }
};

export default commentsSlice;
