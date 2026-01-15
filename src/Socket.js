import { io } from 'socket.io-client';
import Cookies from "js-cookie"
import api from '../src/lib/axios';

// Configuration des URLs selon l'architecture
const RAW_SOCKET_URL = import.meta.env.VITE_SOCKET_SERVICE_HOST;
const DEFAULT_PATH = '/';

// Déterminer l'origine et le chemin (path) pour Socket.IO
let SOCKET_ORIGIN = RAW_SOCKET_URL;
let SOCKET_PATH = DEFAULT_PATH;
// Le token JWT est stocké sous la clé 'jwt'
const TOKEN_NAME = 'jwt';


(async () => {
  try {
    const healthControll = await api.get(DEFAULT_PATH+"/health")
    console.log("===socket health===", {
      ...healthControll.data
    })
  } catch (error) {
    console.warn("⚠️ Backend health check failed - backend may not be running:", error.message)
    console.log("💡 Make sure your backend server is running on http://localhost:8173")
  }
})()


// Classe pour gérer la connexion Socket avec authentification
class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
    this.messageQueue = [];
  }

  // Initialiser la connexion Socket
  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    console.log('🔌 Connexion au Socket Service via:', SOCKET_ORIGIN + SOCKET_PATH, "token:", token);

    this.socket = io(SOCKET_ORIGIN, {
      path: SOCKET_PATH,
      auth: {
        token: token || this.getAuthToken() || localStorage.getItem('jwt') || null
      },
      extraHeaders: {
        'Authorization': 'Bearer ' + token
      },
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      upgrade: true
    });
    console.log(this.socket);
    this.setupEventListeners();
    return this.socket;
  }

  // Configuration des écouteurs d'événements principaux
  setupEventListeners() {
    if (!this.socket) return;

    // Événements de connexion
    this.socket.on('connect', () => {
      console.log('✅ Socket connecté:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Propager l'événement de connexion sur le bus interne
      this.notifyLocal('connect', { id: this.socket.id });

      // Envoyer les messages en attente
      this.flushMessageQueue();

      // Rejoindre les rooms de l'utilisateur
      this.joinUserRooms();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket déconnecté:', reason);
      this.isConnected = false;

      // Propager l'événement de déconnexion sur le bus interne
      this.notifyLocal('disconnect', reason);

      if (reason === 'io server disconnect') {
        // Le serveur a fermé la connexion, reconnecter manuellement
        setTimeout(() => this.reconnect(), 1000);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 Erreur de connexion Socket:', error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
        this.notifyLocal('maxReconnectAttemptsReached', error);
      }
      // Propager l'erreur de connexion
      this.notifyLocal('connect_error', error);
    });

    // Reconnexion réussie
    this.socket.on('reconnect', (attempt) => {
      console.log('🔄 Reconnexion réussie après tentative:', attempt);
      this.notifyLocal('reconnect', attempt);
    });

    // Événements d'authentification
    this.socket.on('unauthorized', (error) => {
      console.error('🔐 Token non valide:', error);
      this.notifyLocal('authenticationFailed', error);
    });

    // Événements métier - messages
    this.socket.on('receiveMessage', (data) => {
      console.log('💬 Message reçu:', data);
      this.notifyLocal('receiveMessage', data);
    });

    this.socket.on('messageDelivered', (data) => {
      console.log('📨 Message livré:', data);
      this.notifyLocal('messageDelivered', data);
    });

    this.socket.on('messageRead', (data) => {
      console.log('👀 Message lu:', data);
      this.notifyLocal('messageRead', data);
    });

    this.socket.on('userTyping', (data) => {
      // data: { roomId, userId, userName, isTyping }
      this.notifyLocal('userTyping', data);
    });

    // Notifications
    this.socket.on('notification', (data) => {
      console.log('🔔 Notification reçue:', data);
      this.notifyLocal('notification', data);
    });
    // Alias conforme à la doc (notification:received)
    this.socket.on('notification:received', (data) => {
      console.log('🔔 Notification reçue (namespaced):', data);
      this.notifyLocal('notification', data);
    });

    this.socket.on('productUpdate', (data) => {
      console.log('📦 Mise à jour produit:', data);
      this.notifyLocal('productUpdate', data);
    });

    this.socket.on('orderStatusUpdate', (data) => {
      console.log('📋 Mise à jour commande:', data);
      this.notifyLocal('orderStatusUpdate', data);
    });

    this.socket.on('priceDropAlert', (data) => {
      console.log('💰 Alerte baisse de prix:', data);
      this.notifyLocal('priceDropAlert', data);
    });

    // Statut en ligne des utilisateurs
    this.socket.on('userOnline', (data) => {
      this.notifyLocal('userOnline', data);
    });
    this.socket.on('user-online', (data) => {
      this.notifyLocal('userOnline', data);
    });

    this.socket.on('userOffline', (data) => {
      this.notifyLocal('userOffline', data);
    });
    this.socket.on('user-offline', (data) => {
      this.notifyLocal('userOffline', data);
    });

    // Erreurs applicatives
    this.socket.on('error', (data) => {
      console.error('🚨 Erreur Socket:', data);
      this.notifyLocal('error', data);
    });
  }

  // Obtenir le token d'authentification
  getAuthToken() {
    try {
      return localStorage.getItem(TOKEN_NAME) || Cookies.get(TOKEN_NAME) || null;
    } catch {
      return null;
    }
  }

  // Rejoindre les rooms utilisateur
  joinUserRooms() {
    const user = this.getCurrentUser();
    if (user) {
      this.emit('joinRoom', { roomId: `user:${user.id}`, userId: user.id });

      // Si c'est un vendeur, rejoindre la room store
      if (user.storeId) {
        this.emit('joinRoom', { roomId: `store:${user.storeId}`, userId: user.id });
      }
    }
  }

  // Obtenir l'utilisateur actuel depuis le localStorage ou Redux
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Émettre un événement
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('📤 Socket non connecté, ajout à la file d\'attente:', event, data);
      this.messageQueue.push({ event, data });
    }
  }

  // Vider la file d'attente des messages
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { event, data } = this.messageQueue.shift();
      this.socket.emit(event, data);
    }
  }

  // Écouter un événement via le bus interne
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  // Arrêter d'écouter un événement
  off(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  // Reconnecter manuellement
  reconnect() {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.connect();
    }
  }

  // Déconnecter
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.listeners.clear();
    this.messageQueue = [];
  }

  // Méthodes utilitaires pour les messages
  sendMessage(roomId, message, recipientId) {
    const payload = {
      roomId,
      message,
      recipientId,
      sender: this.getCurrentUser()?.id,
      timestamp: Date.now()
    };
    // Format interne existant
    this.emit('sendMessage', payload);
    // Alias conforme à la doc
    this.emit('chat:send-message', payload);
  }

  joinChatRoom(roomId) {
    // Format interne existant
    this.emit('joinRoom', { roomId });
    // Alias conforme à la doc
    this.emit('join-room', roomId);
  }

  leaveChatRoom(roomId) {
    // Format interne existant
    this.emit('leaveRoom', { roomId });
    // Alias conforme à la doc
    this.emit('leave-room', roomId);
  }

  // Marquer une notification comme lue
  markNotificationAsRead(notificationId) {
    // Format interne existant
    this.emit('markNotificationRead', { notificationId });
    // Alias conforme à la doc
    this.emit('notification:mark-read', { notificationId });
  }

  // État de la connexion
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Instance singleton
const socketManager = new SocketManager();

export default socketManager;
export { SocketManager };
