import api from '@/lib/axios';

/**
 * Conversation Service — Handles all REST API calls for conversations
 * Based on PLAN_ACTION_INTEGRATION.md PHASE 5.1
 */

export const conversationService = {
  /**
   * POST /conversations
   * Get or create a conversation with a store
   * @param {string} storeId - The store ID
   * @returns {Promise} Conversation object
   */
  getOrCreateConversation: async (storeId) => {
    const { data } = await api.post('/conversations', { storeId });
    return data.payload;
  },

  /**
   * GET /conversations
   * Fetch user's conversations with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Results per page (default: 20)
   * @returns {Promise} Paginated conversations list
   */
  getMyConversations: async (page = 1, limit = 20) => {
    const { data } = await api.get(`/conversations?page=${page}&limit=${limit}`);
    return data.payload;
  },

  /**
   * GET /conversations/:id
   * Fetch a specific conversation details
   * @param {string} conversationId - The conversation ID
   * @returns {Promise} Conversation object with metadata
   */
  getConversation: async (conversationId) => {
    const { data } = await api.get(`/conversations/${conversationId}`);
    return data.payload;
  },

  /**
   * GET /conversations/:id/messages
   * Fetch messages for a conversation with pagination
   * @param {string} conversationId - The conversation ID
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Results per page (default: 30)
   * @returns {Promise} Paginated messages list
   */
  getMessages: async (conversationId, page = 1, limit = 30) => {
    const { data } = await api.get(
      `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
    return data.payload;
  },

  /**
   * POST /conversations/:id/messages
   * Send a new message in a conversation
   * @param {string} conversationId - The conversation ID
   * @param {string} content - Message content
   * @param {object} metadata - Optional metadata (attachments, etc.)
   * @returns {Promise} Created message object
   */
  sendMessage: async (conversationId, content, metadata = {}) => {
    const { data } = await api.post(
      `/conversations/${conversationId}/messages`,
      { content, ...metadata }
    );
    return data.payload;
  },

  /**
   * PUT /conversations/:id/messages/read
   * Mark messages as read
   * @param {string} conversationId - The conversation ID
   * @param {array} messageIds - Array of message IDs to mark as read (optional)
   * @returns {Promise} Updated conversation
   */
  markMessagesAsRead: async (conversationId, messageIds = []) => {
    const { data } = await api.put(
      `/conversations/${conversationId}/messages/read`,
      { messageIds }
    );
    return data.payload;
  },

  /**
   * DELETE /conversations/:id/messages/:messageId
   * Delete a message (if owner)
   * @param {string} conversationId - The conversation ID
   * @param {string} messageId - The message ID to delete
   * @returns {Promise} Delete confirmation
   */
  deleteMessage: async (conversationId, messageId) => {
    const { data } = await api.delete(
      `/conversations/${conversationId}/messages/${messageId}`
    );
    return data.payload;
  },

  /**
   * PATCH /conversations/:id/messages/:messageId
   * Edit a message (if owner)
   * @param {string} conversationId - The conversation ID
   * @param {string} messageId - The message ID to edit
   * @param {string} content - New message content
   * @returns {Promise} Updated message object
   */
  editMessage: async (conversationId, messageId, content) => {
    const { data } = await api.patch(
      `/conversations/${conversationId}/messages/${messageId}`,
      { content }
    );
    return data.payload;
  },

  /**
   * DELETE /conversations/:id
   * Delete/archive a conversation
   * @param {string} conversationId - The conversation ID
   * @returns {Promise} Delete confirmation
   */
  deleteConversation: async (conversationId) => {
    const { data } = await api.delete(`/conversations/${conversationId}`);
    return data.payload;
  },

  /**
   * GET /conversations/:id/members
   * Get conversation members
   * @param {string} conversationId - The conversation ID
   * @returns {Promise} Array of conversation members
   */
  getConversationMembers: async (conversationId) => {
    const { data } = await api.get(`/conversations/${conversationId}/members`);
    return data.payload;
  },
};

export default conversationService;
