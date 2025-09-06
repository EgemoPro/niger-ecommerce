import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketManager from '../Socket.js';
import { socketActions } from '../redux/middleware/socketMiddleware.js';
import {
    addMessage,
    setCurrentRoom,
    markRoomAsRead,
    setOnlineUsers,
    setTyping,
    toggleChat,
    openChat,
    closeChat
} from '../redux/Slices/messageSlice.js';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour gérer les WebSockets et les fonctionnalités de chat
 * @param {Object} options - Options de configuration
 * @returns {Object} - Méthodes et état du socket
 */
export const useSocket = (options = {}) => {
    const dispatch = useDispatch();
    
    // États depuis Redux
    const auth = useSelector(state => state.auth);
    const messages = useSelector(state => state.messages);
    const notifications = useSelector(state => state.notifications);
    
    // État local
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [isReconnecting, setIsReconnecting] = useState(false);
    
    // Configuration par défaut
    const envDebug = (import.meta.env?.VITE_DEBUG_SOCKET ?? 'false') === 'true';
    const {
        autoConnect = true,
        enableLogging = envDebug,
        reconnectOnAuthChange = true
    } = options;

    // === CONNEXION ET DÉCONNEXION ===
    const connect = useCallback(() => {

        if (!auth.token) {
            if (enableLogging) {
                console.warn('useSocket: Aucun token disponible pour la connexion');
            }
            return;
        }

        try {
            setConnectionStatus('connecting');
            // Ne pas logger le token pour des raisons de sécurité
            if (enableLogging) {
                console.log('🔌 useSocket: Tentative de connexion avec token présent');
            }
            console.log('🔌 useSocket: Tentative de connexion avec token présent', auth.token);
            socketManager.connect(auth.token);
        } catch (error) {
            console.error('useSocket: Erreur lors de la connexion:', error);
            setConnectionStatus('error');
        }
    }, [auth.token, enableLogging]);

    const disconnect = useCallback(() => {
        socketManager.disconnect();
        setConnectionStatus('disconnected');
        setIsReconnecting(false);
        
        if (enableLogging) {
            console.log('🔌 useSocket: Déconnexion');
        }
    }, [enableLogging]);

    // === GESTION DES MESSAGES ===
    const sendMessage = useCallback((roomId, message, recipientId = null) => {
        if (!socketManager.isSocketConnected()) {
            toast.error('Impossible d\'envoyer le message', {
                description: 'Connexion au chat non disponible'
            });
            return;
        }

        dispatch(socketActions.sendMessage(roomId, message, recipientId));
        
        if (enableLogging) {
            console.log(`💬 useSocket: Envoi message vers ${roomId}:`, message);
        }
    }, [dispatch, enableLogging]);

    const joinRoom = useCallback((roomId, type = 'user') => {
        if (!socketManager.isSocketConnected()) {
            console.warn('useSocket: Impossible de rejoindre la room, socket non connecté');
            return;
        }

        dispatch(socketActions.joinRoom(roomId));
        
        // Mettre à jour l'état local
        dispatch(setCurrentRoom(roomId));
        
        if (enableLogging) {
            console.log(`🏠 useSocket: Rejoindre room ${roomId}`);
        }
    }, [dispatch, enableLogging]);

    const leaveRoom = useCallback((roomId) => {
        dispatch(socketActions.leaveRoom(roomId));
        
        if (enableLogging) {
            console.log(`🚪 useSocket: Quitter room ${roomId}`);
        }
    }, [dispatch, enableLogging]);

    // === GESTION DU CHAT ===
    const openChatWithRoom = useCallback((roomId, type = 'user') => {
        dispatch(openChat());
        joinRoom(roomId, type);
    }, [dispatch, joinRoom]);

    const closeChatAndLeaveRoom = useCallback(() => {
        if (messages.currentRoom) {
            leaveRoom(messages.currentRoom);
        }
        dispatch(closeChat());
    }, [dispatch, leaveRoom, messages.currentRoom]);

    const markRoomMessagesAsRead = useCallback((roomId) => {
        dispatch(markRoomAsRead(roomId));
        
        // Notifier le serveur que les messages ont été lus
        if (socketManager.isSocketConnected()) {
            socketManager.emit('markMessagesRead', { roomId });
        }
    }, [dispatch]);

    // === INDICATION DE FRAPPE ===
    const [typingTimeout, setTypingTimeout] = useState(null);
    
    const startTyping = useCallback((roomId) => {
        if (!socketManager.isSocketConnected()) return;
        
        const user = auth.user;
        if (!user) return;
        
        socketManager.emit('startTyping', {
            roomId,
            userId: user.id,
            userName: user.username || user.name
        });
        
        // Arrêter automatiquement après 3 secondes d'inactivité
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        
        const timeout = setTimeout(() => {
            stopTyping(roomId);
        }, 3000);
        
        setTypingTimeout(timeout);
    }, [auth.user, typingTimeout]);
    
    const stopTyping = useCallback((roomId) => {
        if (!socketManager.isSocketConnected()) return;
        
        const user = auth.user;
        if (!user) return;
        
        socketManager.emit('stopTyping', {
            roomId,
            userId: user.id
        });
        
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            setTypingTimeout(null);
        }
    }, [auth.user, typingTimeout]);

    // === NOTIFICATIONS ===
    const markNotificationAsRead = useCallback((notificationId) => {
        dispatch(socketActions.markNotificationRead(notificationId));
    }, [dispatch]);

    // === ÉTATS ET STATUTS ===
    const getConnectionStatus = useCallback(() => {
        if (socketManager.isSocketConnected()) {
            return 'connected';
        } else if (isReconnecting) {
            return 'reconnecting';
        } else {
            return connectionStatus;
        }
    }, [connectionStatus, isReconnecting]);

    const getUnreadMessagesCount = useCallback((roomId = null) => {
        if (roomId) {
            const room = messages.activeRooms.find(r => r.roomId === roomId);
            return room?.unreadCount || 0;
        } else {
            return messages.activeRooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
        }
    }, [messages.activeRooms]);

    const getOnlineStatus = useCallback((userId) => {
        const userStatus = messages.onlineUsers[userId];
        return userStatus?.online || false;
    }, [messages.onlineUsers]);

    const getLastSeen = useCallback((userId) => {
        const userStatus = messages.onlineUsers[userId];
        return userStatus?.lastSeen || null;
    }, [messages.onlineUsers]);

    const isUserTyping = useCallback((roomId, userId) => {
        const typingUsers = messages.typingUsers[roomId] || [];
        return typingUsers.some(user => user.userId === userId);
    }, [messages.typingUsers]);

    // === EFFECTS ===
    
    // Connexion automatique lors du login
    useEffect(() => {
        if (auth.isAuthenticated && auth.token && autoConnect) {
            connect();
        } else if (!auth.isAuthenticated) {
            disconnect();
        }
    }, [auth.isAuthenticated, auth.token, autoConnect, connect, disconnect]);

    // Gestion des événements de connexion
    useEffect(() => {
        const handleConnect = () => {
            setConnectionStatus('connected');
            setIsReconnecting(false);
            
            if (enableLogging) {
                console.log('✅ useSocket: Connexion établie');
            }
        };

        const handleDisconnect = (reason) => {
            setConnectionStatus('disconnected');
            
            if (reason !== 'io client disconnect') {
                setIsReconnecting(true);
            }
            
            if (enableLogging) {
                console.log('❌ useSocket: Connexion perdue:', reason);
            }
        };

        const handleConnectError = (error) => {
            setConnectionStatus('error');
            setIsReconnecting(false);
            
            if (enableLogging) {
                console.error('🚨 useSocket: Erreur de connexion:', error);
            }
        };

        const handleReconnect = () => {
            setIsReconnecting(false);
            
            if (enableLogging) {
                console.log('🔄 useSocket: Reconnexion réussie');
            }
        };

        // Écouter les événements de connexion
        socketManager.on('connect', handleConnect);
        socketManager.on('disconnect', handleDisconnect);
        socketManager.on('connect_error', handleConnectError);
        socketManager.on('reconnect', handleReconnect);

        // Nettoyage
        return () => {
            socketManager.off('connect', handleConnect);
            socketManager.off('disconnect', handleDisconnect);
            socketManager.off('connect_error', handleConnectError);
            socketManager.off('reconnect', handleReconnect);
        };
    }, [enableLogging]);

    // Nettoyage lors du démontage du composant
    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    // === RETURN ===
    return {
        // État de connexion
        isConnected: getConnectionStatus() === 'connected',
        connectionStatus: getConnectionStatus(),
        isReconnecting,
        
        // Méthodes de connexion
        connect,
        disconnect,
        
        // Gestion des messages
        sendMessage,
        joinRoom,
        leaveRoom,
        markRoomMessagesAsRead,
        
        // Gestion du chat
        openChatWithRoom,
        closeChatAndLeaveRoom,
        
        // Indication de frappe
        startTyping,
        stopTyping,
        
        // Notifications
        markNotificationAsRead,
        
        // Utilitaires et états
        getUnreadMessagesCount,
        getOnlineStatus,
        getLastSeen,
        isUserTyping,
        
        // États depuis Redux
        messages,
        notifications,
        
        // Utilisateur courant
        currentUserId: auth.user?.id || null,
        currentUser: auth.user || null,
        
        // Instance du socket (pour les cas avancés)
        socketManager
    };
};

export default useSocket;
