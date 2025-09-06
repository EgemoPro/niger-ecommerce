import socketManager from '../../Socket.js';
import { setBasket, setMessage } from '../Slices/notificationSlice.js';
// import { loginSuccess } from '../Slices/authSlice.js';
import { toast } from 'sonner';

// Actions pour les messages
const messageActions = {
  ADD_MESSAGE: 'messages/addMessage',
  SET_MESSAGES: 'messages/setMessages',
  UPDATE_MESSAGE: 'messages/updateMessage',
  SET_TYPING: 'messages/setTyping',
  SET_ONLINE_USERS: 'messages/setOnlineUsers'
};

// Actions pour les notifications temps réel
const notificationActions = {
  ADD_NOTIFICATION: 'notifications/addNotification',
  UPDATE_NOTIFICATION_COUNT: 'notifications/updateCount',
  MARK_NOTIFICATION_READ: 'notifications/markAsRead'
};

// Middleware Socket Redux
const socketMiddleware = (store) => (next) => (action) => {
  const { dispatch, getState } = store;
  const state = getState();

  // Traiter l'action normalement
  const result = next(action);

  // Actions qui déclenchent une connexion Socket
  switch (action.type) {
    case 'auth/loginSuccess':
    case 'auth/restoreAuth': {
      const { token, user } = action.payload || {};
      
      if (token) {
        // Configurer les écouteurs d'événements et (re)connecter proprement
        setupSocketListeners(dispatch, getState);
      }
      break;
    }

    case 'auth/logout': {
      // Déconnecter le socket lors de la déconnexion
      socketManager.disconnect();
      break;
    }

    // Actions pour envoyer des messages
    case 'SOCKET_SEND_MESSAGE': {
      const { roomId, message, recipientId } = action.payload;
      socketManager.sendMessage(roomId, message, recipientId);
      break;
    }

    // Actions pour rejoindre/quitter des rooms
    case 'SOCKET_JOIN_ROOM': {
      const { roomId } = action.payload;
      socketManager.joinChatRoom(roomId);
      break;
    }

    case 'SOCKET_LEAVE_ROOM': {
      const { roomId } = action.payload;
      socketManager.leaveChatRoom(roomId);
      break;
    }

    // Marquer une notification comme lue
    case 'SOCKET_MARK_NOTIFICATION_READ': {
      const { notificationId } = action.payload;
      socketManager.markNotificationAsRead(notificationId);
      break;
    }

    default:
      break;
  }

  return result;
};

// Configuration des écouteurs Socket
function setupSocketListeners(dispatch, getState) {
  // Nettoyer les anciens écouteurs
  socketManager.disconnect();
  
  // Reconnexion avec token
  const state = getState();
  const token = state.auth?.token;
  
  if (!token) {
    console.warn('⚠️ Aucun token disponible pour la connexion Socket');
    return;
  }

  socketManager.connect(token);

  // === ÉVÉNEMENTS DE CONNEXION ===
  socketManager.on('connect', () => {
    console.log('🟢 Socket connecté au serveur');
    toast.success('Connecté au chat en temps réel');
  });

  socketManager.on('disconnect', (reason) => {
    console.log('🔴 Socket déconnecté:', reason);
    if (reason !== 'io client disconnect') {
      toast.warning('Connexion perdue, reconnexion...');
    }
  });

  socketManager.on('connect_error', (error) => {
    console.error('❌ Erreur de connexion Socket:', error);
    toast.error('Erreur de connexion au chat');
  });

  socketManager.on('authenticationFailed', (error) => {
    console.error('🔐 Échec authentification Socket:', error);
    toast.error('Authentification échouée, veuillez vous reconnecter');
    dispatch({ type: 'auth/logout' });
  });

  // === ÉVÉNEMENTS MESSAGES ===
  socketManager.on('receiveMessage', (messageData) => {
    console.log('💬 Nouveau message reçu:', messageData);
    
    dispatch({
      type: messageActions.ADD_MESSAGE,
      payload: {
        id: messageData.id || Date.now(),
        roomId: messageData.roomId,
        message: messageData.message,
        sender: messageData.sender,
        senderName: messageData.senderName,
        timestamp: messageData.timestamp,
        type: messageData.type || 'text',
        read: false
      }
    });

    // Incrémenter le compteur de messages non lus
    const currentCount = getState().notifications?.message || 0;
    dispatch(setMessage(currentCount + 1));

    // Notification toast pour les nouveaux messages
    const currentUser = getState().auth?.user;
    if (messageData.sender !== currentUser?.id) {
      toast.success(`Nouveau message de ${messageData.senderName || 'Inconnu'}`);
    }
  });

  socketManager.on('messageDelivered', (messageData) => {
    dispatch({
      type: messageActions.UPDATE_MESSAGE,
      payload: {
        messageId: messageData.messageId,
        delivered: true
      }
    });
  });

  socketManager.on('messageRead', (messageData) => {
    dispatch({
      type: messageActions.UPDATE_MESSAGE,
      payload: {
        messageId: messageData.messageId,
        read: true
      }
    });
  });

  // Indication de frappe
  socketManager.on('userTyping', (data) => {
    dispatch({
      type: messageActions.SET_TYPING,
      payload: {
        roomId: data.roomId,
        userId: data.userId,
        userName: data.userName,
        isTyping: data.isTyping
      }
    });
  });

  // === ÉVÉNEMENTS NOTIFICATIONS ===
  socketManager.on('notification', (notificationData) => {
    console.log('🔔 Nouvelle notification:', notificationData);
    
    const notification = {
      id: notificationData.id || Date.now(),
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      timestamp: new Date(),
      read: false,
      priority: notificationData.priority || 'medium',
      actionUrl: notificationData.actionUrl,
      icon: getNotificationIcon(notificationData.type),
      color: getNotificationColor(notificationData.type)
    };

    dispatch({
      type: notificationActions.ADD_NOTIFICATION,
      payload: notification
    });

    // Toast selon la priorité
    if (notification.priority === 'high') {
      toast.error(notification.title, {
        description: notification.message,
        duration: 5000
      });
    } else if (notification.priority === 'medium') {
      toast.success(notification.title, {
        description: notification.message
      });
    } else {
      toast.info(notification.title, {
        description: notification.message
      });
    }
  });

  // Notifications spécifiques métier
  socketManager.on('orderStatusUpdate', (orderData) => {
    console.log('📋 Mise à jour commande:', orderData);
    
    dispatch({
      type: notificationActions.ADD_NOTIFICATION,
      payload: {
        id: Date.now(),
        type: 'order_update',
        title: 'Commande mise à jour',
        message: `Votre commande #${orderData.orderNumber} : ${orderData.status}`,
        timestamp: new Date(),
        read: false,
        priority: 'high',
        actionUrl: `/orders/${orderData.orderId}`,
        icon: '📋',
        color: 'bg-blue-500'
      }
    });
    
    toast.success(`Commande #${orderData.orderNumber}`, {
      description: orderData.status
    });
  });

  socketManager.on('priceDropAlert', (priceData) => {
    console.log('💰 Alerte baisse de prix:', priceData);
    
    dispatch({
      type: notificationActions.ADD_NOTIFICATION,
      payload: {
        id: Date.now(),
        type: 'price_drop',
        title: '🔥 Baisse de prix !',
        message: `${priceData.productName} : -${priceData.discountPercent}%`,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
        actionUrl: `/products/${priceData.productId}`,
        icon: '💰',
        color: 'bg-red-500'
      }
    });
    
    toast.success('Baisse de prix !', {
      description: `${priceData.productName} à ${priceData.newPrice}€`
    });
  });

  socketManager.on('productUpdate', (productData) => {
    console.log('📦 Mise à jour produit:', productData);
    
    if (productData.type === 'back_in_stock') {
      dispatch({
        type: notificationActions.ADD_NOTIFICATION,
        payload: {
          id: Date.now(),
          type: 'stock_alert',
          title: '✨ Retour en stock !',
          message: `${productData.productName} est de nouveau disponible`,
          timestamp: new Date(),
          read: false,
          priority: 'medium',
          actionUrl: `/products/${productData.productId}`,
          icon: '📦',
          color: 'bg-green-500'
        }
      });
      
      toast.success('Retour en stock !', {
        description: productData.productName
      });
    }
  });

  // === ÉVÉNEMENTS UTILISATEURS EN LIGNE ===
  socketManager.on('userOnline', (userData) => {
    dispatch({
      type: messageActions.SET_ONLINE_USERS,
      payload: {
        userId: userData.userId,
        online: true,
        lastSeen: new Date()
      }
    });
  });

  socketManager.on('userOffline', (userData) => {
    dispatch({
      type: messageActions.SET_ONLINE_USERS,
      payload: {
        userId: userData.userId,
        online: false,
        lastSeen: new Date()
      }
    });
  });

  // === ÉVÉNEMENTS D'ERREUR ===
  socketManager.on('error', (errorData) => {
    console.error('🚨 Erreur Socket:', errorData);
    toast.error('Erreur de communication', {
      description: errorData.message
    });
  });
}

// Utilitaires pour les notifications
function getNotificationIcon(type) {
  const icons = {
    order_confirmed: '✅',
    order_shipped: '🚚',
    order_delivered: '📦',
    payment_success: '💳',
    price_drop: '💰',
    stock_alert: '📦',
    message: '💬',
    promo: '🎉',
    birthday: '🎂'
  };
  return icons[type] || '🔔';
}

function getNotificationColor(type) {
  const colors = {
    order_confirmed: 'bg-green-500',
    order_shipped: 'bg-blue-500',
    order_delivered: 'bg-green-600',
    payment_success: 'bg-blue-500',
    price_drop: 'bg-red-500',
    stock_alert: 'bg-green-500',
    message: 'bg-purple-500',
    promo: 'bg-orange-500',
    birthday: 'bg-pink-500'
  };
  return colors[type] || 'bg-gray-500';
}

// Actions creators pour déclencher les événements Socket
export const socketActions = {
  sendMessage: (roomId, message, recipientId) => ({
    type: 'SOCKET_SEND_MESSAGE',
    payload: { roomId, message, recipientId }
  }),
  
  joinRoom: (roomId) => ({
    type: 'SOCKET_JOIN_ROOM',
    payload: { roomId }
  }),
  
  leaveRoom: (roomId) => ({
    type: 'SOCKET_LEAVE_ROOM',
    payload: { roomId }
  }),
  
  markNotificationRead: (notificationId) => ({
    type: 'SOCKET_MARK_NOTIFICATION_READ',
    payload: { notificationId }
  })
};

export { messageActions, notificationActions };
export default socketMiddleware;
