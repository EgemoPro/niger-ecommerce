import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketManager from '../Socket';
import {
  newMessageReceived,
  addTypingUser,
  removeTypingUser,
  messagesMarkedAsRead,
  messageDelivered,
  setUnreadCount,
  sendMessage,
  markMessagesAsRead,
} from '../redux/Slices/conversationsSlice';
import { conversationsSelectors } from '../redux/Slices/conversationsSlice';

/**
 * Hook personnalisé pour gérer les WebSockets Socket.IO dans une conversation
 * Gère:
 * - Rejoindre/quitter une conversation
 * - Recevoir les nouveaux messages temps réel
 * - Affichage de qui tape
 * - Marquer les messages comme lus
 * - Gestion de la livraison
 *
 * @param {string} conversationId - ID de la conversation
 * @returns {Object} - Méthodes et états
 */
export const useConversationSocket = (conversationId) => {
  const dispatch = useDispatch();
  
  // État depuis Redux
  const currentUser = useSelector((state) => state.auth?.user);
  const typingUsers = useSelector((state) =>
    conversationsSelectors.selectTypingUsers(state, conversationId)
  );
  const messages = useSelector(conversationsSelectors.selectMessages);
  
  // Refs pour éviter les re-renders inutiles
  const typingTimeoutRef = useRef(null);
  const conversationIdRef = useRef(conversationId);
  const socketListenersRef = useRef(new Map());
  
  /**
   * Rejoindre la conversation
   */
  const joinConversation = useCallback(() => {
    if (!conversationId || !currentUser?.id) {
      console.warn('Cannot join conversation: missing conversationId or userId');
      return;
    }

    socketManager.joinConversation(conversationId, currentUser.id);
    console.log(`✅ Joined conversation: ${conversationId}`);
  }, [conversationId, currentUser?.id]);

  /**
   * Quitter la conversation
   */
  const leaveConversation = useCallback(() => {
    if (!conversationId || !currentUser?.id) return;

    socketManager.leaveConversation(conversationId, currentUser.id);
    stopTyping();
    console.log(`✅ Left conversation: ${conversationId}`);
  }, [conversationId, currentUser?.id]);

  /**
   * Envoyer un message
   * @param {string} text - Contenu du message
   * @param {Object} metadata - Données supplémentaires (optionnel)
   */
  const sendChatMessage = useCallback(
    (text, metadata = {}) => {
      if (!text.trim() || !conversationId) return;

      socketManager.sendConversationMessage(conversationId, text, metadata);
      
      // Aussi dispatcher une action Redux pour l'envoi HTTP
      dispatch(
        sendMessage(conversationId, {
          text,
          ...metadata,
        })
      );
    },
    [conversationId, dispatch]
  );

  /**
   * Envoyer l'événement "je suis en train de taper"
   */
  const startTyping = useCallback(() => {
    if (!conversationId || !socketManager.isSocketConnected()) return;

    socketManager.startConversationTyping(conversationId);

    // Arrêter automatiquement après 3 secondes d'inactivité
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [conversationId]);

  /**
   * Arrêter l'événement "je suis en train de taper"
   */
  const stopTyping = useCallback(() => {
    if (!conversationId || !socketManager.isSocketConnected()) return;

    socketManager.stopConversationTyping(conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [conversationId]);

  /**
   * Marquer les messages comme lus
   * @param {string[]} messageIds - Liste des IDs des messages (optionnel)
   */
  const markAsRead = useCallback(
    (messageIds = null) => {
      if (!conversationId) return;

      const ids = messageIds || messages
        .filter((m) => !m.read && m.sender !== currentUser?.id)
        .map((m) => m._id || m.id);

      if (ids.length === 0) return;

      socketManager.markConversationMessagesAsRead(conversationId, ids);
      
      // Aussi faire l'appel HTTP
      dispatch(markMessagesAsRead(conversationId, ids));
    },
    [conversationId, messages, currentUser?.id, dispatch]
  );

  /**
   * Initialiser les écouteurs Socket.IO
   */
  const setupSocketListeners = useCallback(() => {
    // Nouveau message reçu
    const handleNewMessage = (data) => {
      console.log('📩 New message received:', data);
      
      // Seulement ajouter si c'est pour cette conversation
      if (data.conversationId === conversationId) {
        dispatch(newMessageReceived({
          ...data,
          id: data._id || data.id,
          read: data.sender === currentUser?.id,
        }));
      }
    };

    // Utilisateur en train de taper
    const handleUserTyping = (data) => {
      if (data.conversationId === conversationId) {
        dispatch(addTypingUser({
          conversationId,
          userId: data.userId,
          userName: data.userName,
        }));
      }
    };

    // Utilisateur arrêté de taper
    const handleUserStoppedTyping = (data) => {
      if (data.conversationId === conversationId) {
        dispatch(removeTypingUser({
          conversationId,
          userId: data.userId,
        }));
      }
    };

    // Messages marqués comme lus
    const handleMessagesRead = (data) => {
      if (data.conversationId === conversationId) {
        dispatch(messagesMarkedAsRead({
          messageIds: data.messageIds || [],
        }));
      }
    };

    // Message livré
    const handleMessageDelivered = (data) => {
      if (data.conversationId === conversationId) {
        dispatch(messageDelivered({
          messageId: data.messageId,
        }));
      }
    };

    // Attacher les écouteurs
    socketManager.on('newMessage', handleNewMessage);
    socketManager.on('conversationTyping', handleUserTyping);
    socketManager.on('conversationTypingStopped', handleUserStoppedTyping);
    socketManager.on('messageRead', handleMessagesRead);
    socketManager.on('messageDelivered', handleMessageDelivered);

    // Stocker les références pour le nettoyage
    socketListenersRef.current.set('newMessage', handleNewMessage);
    socketListenersRef.current.set('conversationTyping', handleUserTyping);
    socketListenersRef.current.set('conversationTypingStopped', handleUserStoppedTyping);
    socketListenersRef.current.set('messageRead', handleMessagesRead);
    socketListenersRef.current.set('messageDelivered', handleMessageDelivered);

    return () => {
      // Nettoyer les écouteurs
      socketManager.off('newMessage', handleNewMessage);
      socketManager.off('conversationTyping', handleUserTyping);
      socketManager.off('conversationTypingStopped', handleUserStoppedTyping);
      socketManager.off('messageRead', handleMessagesRead);
      socketManager.off('messageDelivered', handleMessageDelivered);
      socketListenersRef.current.clear();
    };
  }, [conversationId, currentUser?.id, dispatch]);

  /**
   * Effects pour gérer le cycle de vie de la conversation
   */

  // Rejoindre à la connexion, quitter au démontage
  useEffect(() => {
    if (!conversationId) return;

    conversationIdRef.current = conversationId;
    
    if (socketManager.isSocketConnected()) {
      joinConversation();
    }

    return () => {
      leaveConversation();
    };
  }, [conversationId, joinConversation, leaveConversation]);

  // Configurer les écouteurs Socket.IO
  useEffect(() => {
    if (!conversationId) return;

    const cleanup = setupSocketListeners();
    
    return cleanup;
  }, [conversationId, setupSocketListeners]);

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Retourner les méthodes et états
   */
  return {
    // Méthodes
    sendMessage: sendChatMessage,
    startTyping,
    stopTyping,
    markAsRead,
    joinConversation,
    leaveConversation,
    
    // État
    typingUsers,
    isTyping: typingUsers.length > 0,
    isSocketConnected: socketManager.isSocketConnected(),
    
    // Utilitaire
    socketManager,
  };
};

export default useConversationSocket;
