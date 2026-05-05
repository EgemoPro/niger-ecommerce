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
  // Real-time state
  typingUsers: {}, // { conversationId: [{ userId, userName }] }
  unreadCounts: {}, // { conversationId: number }
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

    // ✅ DEPRECATED: Utiliser newMessageReceived à la place
    // Maintenu pour rétrocompatibilité uniquement
    messageAdded: (state, action) => {
      if (state.messages) {
        state.messages.push(action.payload);
        state.totalMessages = state.messages.length;
      }
    },

    // ✅ DEPRECATED: Utiliser messagesMarkedAsRead à la place
    // Maintenu pour rétrocompatibilité uniquement
    messageUpdated: (state, action) => {
      const { messageId, updates } = action.payload;
      const message = state.messages.find((m) => m.id === messageId || m._id === messageId);
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

    // ✅ DEPRECATED: Utiliser newMessageReceived à la place
    // Maintenu pour rétrocompatibilité uniquement
    messageReceived: (state, action) => {
      const message = action.payload;
      // Check if message already exists (avoid duplicates)
      if (!state.messages.find((m) => m.id === message.id || m._id === message._id)) {
        state.messages.push(message);
        state.totalMessages = state.messages.length;
      }
    },

    // ✅ DEPRECATED: Utiliser addTypingUser/removeTypingUser à la place
    // Maintenu pour rétrocompatibilité uniquement
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

    // ===== REAL-TIME UPDATES FROM SOCKET.IO =====

    /**
     * Réception d'un nouveau message en temps réel
     * Normalise les IDs et évite les doublons
     */
    newMessageReceived: (state, action) => {
      const message = action.payload;
      // Normaliser l'ID du message
      const messageId = message._id || message.id;
      
      // Éviter les doublons
      if (!state.messages.find((m) => m._id === messageId || m.id === messageId)) {
        state.messages.push({
          ...message,
          _id: messageId,
          id: messageId,
          read: message.read || false,
          delivered: message.delivered !== undefined ? message.delivered : true,
          createdAt: message.timestamp || message.createdAt || new Date().toISOString()
        });
        state.totalMessages = state.messages.length;
      }
    },

    /**
     * Mise à jour du statut de frappe
     * Affiche qui est en train de taper dans la conversation
     */
    conversationTypingUpdate: (state, action) => {
      const { conversationId, typingUsers } = action.payload;
      
      if (state.currentConversation && state.currentConversation._id === conversationId) {
        state.typingUsers[conversationId] = typingUsers || [];
      }
    },

    /**
     * Arrêt de la frappe
     */
    conversationTypingStopped: (state, action) => {
      const { conversationId, userId } = action.payload;
      
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
          (u) => u.userId !== userId
        );
      }
    },

    /**
     * Mise à jour du statut "lu" des messages
     */
    messagesMarkedAsRead: (state, action) => {
      const { messageIds } = action.payload;
      
      state.messages.forEach((message) => {
        if (messageIds.includes(message._id) || messageIds.includes(message.id)) {
          message.read = true;
        }
      });
    },

    /**
     * Mettre à jour le statut de livraison d'un message
     */
    messageDelivered: (state, action) => {
      const { messageId } = action.payload;
      const message = state.messages.find((m) => m._id === messageId || m.id === messageId);
      
      if (message) {
        message.delivered = true;
      }
    },

    /**
     * Ajouter un utilisateur qui tape
     */
    addTypingUser: (state, action) => {
      const { conversationId, userId, userName } = action.payload;
      
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      
      // Éviter les doublons
      if (!state.typingUsers[conversationId].find((u) => u.userId === userId)) {
        state.typingUsers[conversationId].push({ userId, userName });
      }
    },

    /**
     * Retirer un utilisateur qui tape
     */
    removeTypingUser: (state, action) => {
      const { conversationId, userId } = action.payload;
      
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
          (u) => u.userId !== userId
        );
      }
    },

    /**
     * Définir le nombre de messages non lus
     */
    setUnreadCount: (state, action) => {
      const { conversationId, count } = action.payload;
      state.unreadCounts[conversationId] = count;
    },

    // Alias pour clearMessages (doublon corrigé)
    clearErrors: (state) => {
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
  clearErrors,
  newMessageReceived,
  conversationTypingUpdate,
  conversationTypingStopped,
  messagesMarkedAsRead,
  messageDelivered,
  addTypingUser,
  removeTypingUser,
  setUnreadCount,
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
  
  // Real-time selectors
  selectTypingUsers: (state, conversationId) => {
    if (!conversationId) return [];
    return state.conversations?.typingUsers?.[conversationId] || [];
  },
  selectAllTypingUsers: (state) => state.conversations?.typingUsers || {},
  selectUnreadCount: (state, conversationId) => {
    if (!conversationId) return 0;
    return state.conversations?.unreadCounts?.[conversationId] || 0;
  },
  selectAllUnreadCounts: (state) => state.conversations?.unreadCounts || {},
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
