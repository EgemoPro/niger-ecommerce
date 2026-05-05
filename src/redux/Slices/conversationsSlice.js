import { createSlice } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import Cookies from "js-cookie";

const TOKEN_KEY = "jwt";

// État initial
const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  totalMessages: 0,
  isLoading: false,
  isLoadingMessages: false,
  error: null,
  successMessage: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
  },
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    // List conversations
    conversationsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    conversationsSuccess: (state, action) => {
      state.conversations = action.payload || [];
      state.isLoading = false;
      state.error = null;
    },
    conversationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get single conversation
    conversationRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    conversationSuccess: (state, action) => {
      state.currentConversation = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    conversationFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get messages for conversation
    messagesRequest: (state) => {
      state.isLoadingMessages = true;
      state.error = null;
    },
    messagesSuccess: (state, action) => {
      const { messages, pagination } = action.payload;
      state.messages = messages || [];
      state.totalMessages = messages?.length || 0;
      if (pagination) {
        state.pagination = pagination;
      }
      state.isLoadingMessages = false;
      state.error = null;
    },
    messagesFailure: (state, action) => {
      state.isLoadingMessages = false;
      state.error = action.payload;
    },

    // Add message to current conversation
    messageAdded: (state, action) => {
      if (state.messages) {
        state.messages.push(action.payload);
        state.totalMessages = state.messages.length;
      }
    },

    // Update message (for read status, etc)
    messageUpdated: (state, action) => {
      const { messageId, updates } = action.payload;
      const message = state.messages.find((m) => m.id === messageId);
      if (message) {
        Object.assign(message, updates);
      }
    },

    // Create conversation
    createConversationRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    createConversationSuccess: (state, action) => {
      state.conversations.unshift(action.payload);
      state.currentConversation = action.payload;
      state.isLoading = false;
      state.successMessage = "Conversation créée";
    },
    createConversationFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Send message
    sendMessageRequest: (state) => {
      state.error = null;
    },
    sendMessageSuccess: (state, action) => {
      state.messages.push(action.payload);
      state.totalMessages = state.messages.length;
      state.error = null;
    },
    sendMessageFailure: (state, action) => {
      state.error = action.payload;
    },

    // Real-time updates from Socket.IO
    messageReceived: (state, action) => {
      const message = action.payload;
      // Check if message already exists (avoid duplicates)
      if (!state.messages.find((m) => m.id === message.id)) {
        state.messages.push(message);
        state.totalMessages = state.messages.length;
      }
    },

    userTyping: (state, action) => {
      // Store typing user info for UI display
      if (!state.currentConversation) return;
      state.currentConversation.typingUsers = action.payload.typingUsers;
    },

    // Clear messages
    clearMessages: (state) => {
      state.messages = [];
      state.totalMessages = 0;
      state.currentConversation = null;
    },

    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
});

// Actions
export const {
  conversationsRequest,
  conversationsSuccess,
  conversationsFailure,
  conversationRequest,
  conversationSuccess,
  conversationFailure,
  messagesRequest,
  messagesSuccess,
  messagesFailure,
  messageAdded,
  messageUpdated,
  createConversationRequest,
  createConversationSuccess,
  createConversationFailure,
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
  messageReceived,
  userTyping,
  clearMessages,
} = conversationsSlice.actions;

// Sélecteurs
export const conversationsSelectors = {
  selectConversations: (state) => state.conversations?.conversations || [],
  selectCurrentConversation: (state) =>
    state.conversations?.currentConversation,
  selectMessages: (state) => state.conversations?.messages || [],
  selectTotalMessages: (state) => state.conversations?.totalMessages || 0,
  selectIsLoading: (state) => state.conversations?.isLoading,
  selectIsLoadingMessages: (state) =>
    state.conversations?.isLoadingMessages,
  selectError: (state) => state.conversations?.error,
  selectSuccessMessage: (state) => state.conversations?.successMessage,
  selectPagination: (state) => state.conversations?.pagination,
};

// Thunks asynchrones

/**
 * Fetch all conversations for a user
 * GET /conversations?userId=:userId
 */
export const fetchConversations = (userId) => async (dispatch) => {
  dispatch(conversationsRequest());
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.get(`/conversations`, {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(conversationsSuccess(response.data.payload || []));
    return response.data.payload;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la récupération des conversations";
    dispatch(conversationsFailure(errorMessage));
    throw error;
  }
};

/**
 * Get single conversation details
 * GET /conversations/:conversationId
 */
export const fetchConversation = (conversationId) => async (dispatch) => {
  dispatch(conversationRequest());
  try {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    const response = await api.get(`/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(conversationSuccess(response.data.payload));
    return response.data.payload;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la récupération de la conversation";
    dispatch(conversationFailure(errorMessage));
    throw error;
  }
};

/**
 * Get messages for a conversation
 * GET /conversations/:conversationId/messages?page=1&limit=50
 */
export const fetchMessages =
  (conversationId, page = 1, limit = 50) =>
  async (dispatch) => {
    dispatch(messagesRequest());
    try {
      const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const response = await api.get(
        `/conversations/${conversationId}/messages`,
        {
          params: { page, limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(
        messagesSuccess({
          messages: response.data.payload?.messages || [],
          pagination: response.data.payload?.pagination || {
            page,
            limit,
            total: 0,
          },
        })
      );
      return response.data.payload;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de la récupération des messages";
      dispatch(messagesFailure(errorMessage));
      throw error;
    }
  };

/**
 * Create new conversation with a vendor
 * POST /conversations
 */
export const createConversation =
  (vendorId, userId) => async (dispatch) => {
    dispatch(createConversationRequest());
    try {
      const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const response = await api.post(
        "/conversations",
        { vendorId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(createConversationSuccess(response.data.payload));
      return response.data.payload;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de la création de la conversation";
      dispatch(createConversationFailure(errorMessage));
      throw error;
    }
  };

/**
 * Send a message
 * POST /conversations/:conversationId/messages
 */
export const sendMessage =
  (conversationId, messageData) => async (dispatch) => {
    dispatch(sendMessageRequest());
    try {
      const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const response = await api.post(
        `/conversations/${conversationId}/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(sendMessageSuccess(response.data.payload));
      return response.data.payload;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Erreur lors de l'envoi du message";
      dispatch(sendMessageFailure(errorMessage));
      throw error;
    }
  };

/**
 * Mark messages as read
 * PUT /conversations/:conversationId/messages/read
 */
export const markMessagesAsRead =
  (conversationId, messageIds) => async (dispatch) => {
    try {
      const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const response = await api.put(
        `/conversations/${conversationId}/messages/read`,
        { messageIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update messages in state
      response.data.payload?.forEach((msgId) => {
        dispatch(messageUpdated({ messageId: msgId, updates: { read: true } }));
      });

      return response.data.payload;
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

export default conversationsSlice;
