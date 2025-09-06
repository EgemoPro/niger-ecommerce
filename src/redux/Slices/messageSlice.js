import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Messages par room
    messagesByRoom: {}, // { roomId: [messages] }
    
    // Rooms actives
    activeRooms: [], // [{ roomId, type, participants, lastMessage, unreadCount }]
    currentRoom: null,
    
    // Utilisateurs en ligne et status
    onlineUsers: {}, // { userId: { online: true, lastSeen: timestamp } }
    typingUsers: {}, // { roomId: [{ userId, userName }] }
    
    // État de l'interface
    isChatOpen: false,
    selectedRoom: null,
    
    // Chargement et erreurs
    loading: false,
    error: null,
    
    // Paramètres du chat
    settings: {
        soundEnabled: true,
        showOnlineStatus: true,
        autoOpenNewMessages: true,
        markAsReadOnOpen: true,
        maxMessagesPerRoom: 500
    }
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        // === GESTION DES MESSAGES ===
        addMessage: (state, action) => {
            const { roomId, message, sender, senderName, timestamp, id, type = 'text', read = false } = action.payload;
            
            // Initialiser la room si elle n'existe pas
            if (!state.messagesByRoom[roomId]) {
                state.messagesByRoom[roomId] = [];
            }
            
            const newMessage = {
                id: id || `msg_${Date.now()}_${Math.random()}`,
                roomId,
                message,
                sender,
                senderName,
                timestamp: timestamp || new Date().toISOString(),
                type,
                read,
                delivered: false,
                edited: false,
                editedAt: null
            };
            
            // Ajouter le message à la fin
            state.messagesByRoom[roomId].push(newMessage);
            
            // Limiter le nombre de messages par room
            const maxMessages = state.settings.maxMessagesPerRoom;
            if (state.messagesByRoom[roomId].length > maxMessages) {
                state.messagesByRoom[roomId] = state.messagesByRoom[roomId].slice(-maxMessages);
            }
            
            // Mettre à jour la room active
            const existingRoom = state.activeRooms.find(room => room.roomId === roomId);
            if (existingRoom) {
                existingRoom.lastMessage = newMessage;
                existingRoom.lastActivity = timestamp;
                
                // Incrémenter le compteur de non lus si ce n'est pas l'utilisateur actuel
                if (!read && state.currentRoom !== roomId) {
                    existingRoom.unreadCount = (existingRoom.unreadCount || 0) + 1;
                }
            } else {
                // Créer une nouvelle room
                state.activeRooms.push({
                    roomId,
                    type: roomId.includes('store:') ? 'store' : roomId.includes('order:') ? 'order' : 'user',
                    participants: [sender],
                    lastMessage: newMessage,
                    lastActivity: timestamp,
                    unreadCount: read ? 0 : 1
                });
            }
            
            // Trier les rooms par dernière activité
            state.activeRooms.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
        },
        
        updateMessage: (state, action) => {
            const { messageId, roomId, delivered, read, edited, newContent } = action.payload;
            
            if (roomId && state.messagesByRoom[roomId]) {
                const message = state.messagesByRoom[roomId].find(msg => msg.id === messageId);
                
                if (message) {
                    if (delivered !== undefined) message.delivered = delivered;
                    if (read !== undefined) message.read = read;
                    if (edited !== undefined) {
                        message.edited = edited;
                        message.editedAt = new Date().toISOString();
                    }
                    if (newContent !== undefined) {
                        message.message = newContent;
                        message.edited = true;
                        message.editedAt = new Date().toISOString();
                    }
                }
            } else {
                // Chercher dans toutes les rooms si roomId n'est pas fourni
                for (const [roomKey, messages] of Object.entries(state.messagesByRoom)) {
                    const message = messages.find(msg => msg.id === messageId);
                    if (message) {
                        if (delivered !== undefined) message.delivered = delivered;
                        if (read !== undefined) message.read = read;
                        if (edited !== undefined) {
                            message.edited = edited;
                            message.editedAt = new Date().toISOString();
                        }
                        break;
                    }
                }
            }
        },
        
        deleteMessage: (state, action) => {
            const { messageId, roomId } = action.payload;
            
            if (state.messagesByRoom[roomId]) {
                const messageIndex = state.messagesByRoom[roomId].findIndex(msg => msg.id === messageId);
                if (messageIndex !== -1) {
                    state.messagesByRoom[roomId].splice(messageIndex, 1);
                }
            }
        },
        
        markRoomAsRead: (state, action) => {
            const roomId = action.payload;
            
            // Marquer tous les messages de la room comme lus
            if (state.messagesByRoom[roomId]) {
                state.messagesByRoom[roomId].forEach(message => {
                    message.read = true;
                });
            }
            
            // Réinitialiser le compteur de non lus
            const room = state.activeRooms.find(r => r.roomId === roomId);
            if (room) {
                room.unreadCount = 0;
            }
        },
        
        // === GESTION DES ROOMS ===
        joinRoom: (state, action) => {
            const { roomId, participants, type } = action.payload;
            
            const existingRoom = state.activeRooms.find(room => room.roomId === roomId);
            
            if (!existingRoom) {
                state.activeRooms.push({
                    roomId,
                    type: type || 'user',
                    participants: participants || [],
                    lastMessage: null,
                    lastActivity: new Date().toISOString(),
                    unreadCount: 0
                });
            }
            
            // Initialiser les messages si nécessaire
            if (!state.messagesByRoom[roomId]) {
                state.messagesByRoom[roomId] = [];
            }
        },
        
        leaveRoom: (state, action) => {
            const roomId = action.payload;
            
            // Retirer de la liste des rooms actives
            state.activeRooms = state.activeRooms.filter(room => room.roomId !== roomId);
            
            // Si c'est la room courante, la déselectionner
            if (state.currentRoom === roomId) {
                state.currentRoom = null;
            }
            if (state.selectedRoom === roomId) {
                state.selectedRoom = null;
            }
        },
        
        setCurrentRoom: (state, action) => {
            const roomId = action.payload;
            state.currentRoom = roomId;
            
            // Marquer automatiquement comme lu si l'option est activée
            if (state.settings.markAsReadOnOpen && roomId) {
                messageSlice.caseReducers.markRoomAsRead(state, { payload: roomId });
            }
        },
        
        setSelectedRoom: (state, action) => {
            state.selectedRoom = action.payload;
        },
        
        // === UTILISATEURS EN LIGNE ===
        setOnlineUsers: (state, action) => {
            const { userId, online, lastSeen } = action.payload;
            
            state.onlineUsers[userId] = {
                online: online,
                lastSeen: lastSeen || new Date().toISOString()
            };
        },
        
        updateUserOnlineStatus: (state, action) => {
            const users = action.payload; // { userId: { online, lastSeen } }
            
            Object.keys(users).forEach(userId => {
                state.onlineUsers[userId] = {
                    online: users[userId].online,
                    lastSeen: users[userId].lastSeen || new Date().toISOString()
                };
            });
        },
        
        // === INDICATION DE FRAPPE ===
        setTyping: (state, action) => {
            const { roomId, userId, userName, isTyping } = action.payload;
            
            if (!state.typingUsers[roomId]) {
                state.typingUsers[roomId] = [];
            }
            
            const typingUser = state.typingUsers[roomId].find(user => user.userId === userId);
            
            if (isTyping) {
                if (!typingUser) {
                    state.typingUsers[roomId].push({ userId, userName });
                }
            } else {
                if (typingUser) {
                    state.typingUsers[roomId] = state.typingUsers[roomId].filter(user => user.userId !== userId);
                }
            }
        },
        
        clearTypingIndicators: (state, action) => {
            const roomId = action.payload;
            if (roomId) {
                state.typingUsers[roomId] = [];
            } else {
                state.typingUsers = {};
            }
        },
        
        // === INTERFACE ===
        toggleChat: (state) => {
            state.isChatOpen = !state.isChatOpen;
        },
        
        openChat: (state) => {
            state.isChatOpen = true;
        },
        
        closeChat: (state) => {
            state.isChatOpen = false;
        },
        
        // === PARAMÈTRES ===
        updateSettings: (state, action) => {
            state.settings = { ...state.settings, ...action.payload };
        },
        
        toggleSetting: (state, action) => {
            const settingKey = action.payload;
            if (settingKey in state.settings) {
                state.settings[settingKey] = !state.settings[settingKey];
            }
        },
        
        // === ÉTAT ===
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        clearError: (state) => {
            state.error = null;
        },
        
        // === NETTOYAGE ===
        clearMessages: (state, action) => {
            const roomId = action.payload;
            if (roomId) {
                state.messagesByRoom[roomId] = [];
            } else {
                state.messagesByRoom = {};
            }
        },
        
        clearAllData: (state) => {
            state.messagesByRoom = {};
            state.activeRooms = [];
            state.currentRoom = null;
            state.selectedRoom = null;
            state.onlineUsers = {};
            state.typingUsers = {};
            state.error = null;
        },
        
        // === UTILITAIRES ===
        setMessages: (state, action) => {
            const { roomId, messages } = action.payload;
            state.messagesByRoom[roomId] = messages;
        },
        
        loadHistoryMessages: (state, action) => {
            const { roomId, messages, prepend = true } = action.payload;
            
            if (!state.messagesByRoom[roomId]) {
                state.messagesByRoom[roomId] = [];
            }
            
            if (prepend) {
                // Ajouter au début (messages plus anciens)
                state.messagesByRoom[roomId] = [...messages, ...state.messagesByRoom[roomId]];
            } else {
                // Ajouter à la fin
                state.messagesByRoom[roomId] = [...state.messagesByRoom[roomId], ...messages];
            }
        }
    }
});

export const {
    // Messages
    addMessage,
    updateMessage,
    deleteMessage,
    markRoomAsRead,
    setMessages,
    loadHistoryMessages,
    
    // Rooms
    joinRoom,
    leaveRoom,
    setCurrentRoom,
    setSelectedRoom,
    
    // Utilisateurs
    setOnlineUsers,
    updateUserOnlineStatus,
    
    // Frappe
    setTyping,
    clearTypingIndicators,
    
    // Interface
    toggleChat,
    openChat,
    closeChat,
    
    // Paramètres
    updateSettings,
    toggleSetting,
    
    // État
    setLoading,
    setError,
    clearError,
    
    // Nettoyage
    clearMessages,
    clearAllData
} = messageSlice.actions;

export default messageSlice;
