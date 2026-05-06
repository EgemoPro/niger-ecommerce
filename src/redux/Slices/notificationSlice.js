import { createSlice } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { NotificationSchema } from "../schemas/index";
import { validatePayload, calculateUnreadCount, sortNotificationsByDate, cleanupOldNotifications } from "../utils/index";
import { logger } from "../../services/logger";

const initialState = {
    // Compteurs de notifications
    basket: 0,
    message: 0,
    totalUnread: 0,
    
    // Liste des notifications
    notifications: [],
    
    // Paramètres de notification
    settings: {
        showToasts: true,
        soundEnabled: true,
        orderUpdates: true,
        promotions: true,
        priceAlerts: true,
        stockAlerts: true,
        messageNotifications: true
    },
    
    // État de chargement
    loading: false,
    error: null
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        // === COMPTEURS ===
        setBasket: (state, action) => {
            try {
                const value = action.payload;
                if (typeof value !== 'number' || value < 0) {
                    logger.warn('Invalid basket count', { value });
                    return;
                }
                state.basket = value;
                logger.debug('Basket count updated', { count: value });
            } catch (error) {
                logger.error('Error in setBasket', error);
            }
        },
        
        setMessage: (state, action) => {
            try {
                const value = action.payload;
                if (typeof value !== 'number' || value < 0) {
                    logger.warn('Invalid message count', { value });
                    return;
                }
                state.message = value;
                logger.debug('Message count updated', { count: value });
            } catch (error) {
                logger.error('Error in setMessage', error);
            }
        },
        
        incrementMessage: (state) => {
            try {
                state.message += 1;
                logger.debug('Message count incremented', { newCount: state.message });
            } catch (error) {
                logger.error('Error in incrementMessage', error);
            }
        },
        
        resetMessageCount: (state) => {
            try {
                state.message = 0;
                logger.debug('Message count reset');
            } catch (error) {
                logger.error('Error in resetMessageCount', error);
            }
        },
        
        updateTotalUnread: (state) => {
            try {
                state.totalUnread = calculateUnreadCount(state.notifications);
                logger.debug('Total unread updated', { count: state.totalUnread });
            } catch (error) {
                logger.error('Error in updateTotalUnread', error);
            }
        },
        
        // === NOTIFICATIONS ===
        addNotification: (state, action) => {
            try {
                const notificationData = action.payload;
                
                // Validation de la notification
                const validation = validatePayload(NotificationSchema, notificationData, 'addNotification');
                if (!validation.success) {
                    state.error = 'Notification invalide';
                    logger.error('Invalid notification in addNotification', validation.error);
                    return;
                }
                
                const notification = {
                    ...validation.data,
                    id: validation.data.id || Date.now(),
                    timestamp: validation.data.timestamp || new Date().toISOString(),
                    read: false
                };
                
                // Ajouter en début de liste
                state.notifications.unshift(notification);
                logger.logNotificationAdded(notification);
                
                // Limiter à 100 notifications max
                if (state.notifications.length > 100) {
                    state.notifications = state.notifications.slice(0, 100);
                    logger.debug('Notifications trimmed to 100');
                }
                
                // Mettre à jour le compteur avec utilitaire
                state.totalUnread = calculateUnreadCount(state.notifications);
                state.error = null;
            } catch (error) {
                state.error = 'Erreur lors de l\'ajout de la notification';
                logger.error('Error in addNotification reducer', error);
            }
        },
        
        markAsRead: (state, action) => {
            const notificationId = action.payload;
            const notification = state.notifications.find(n => n.id === notificationId);
            
            if (notification && !notification.read) {
                notification.read = true;
                state.totalUnread = state.notifications.filter(n => !n.read).length;
            }
        },
        
        markAsUnread: (state, action) => {
            const notificationId = action.payload;
            const notification = state.notifications.find(n => n.id === notificationId);
            
            if (notification && notification.read) {
                notification.read = false;
                state.totalUnread = state.notifications.filter(n => !n.read).length;
            }
        },
        
        markAllAsRead: (state) => {
            state.notifications.forEach(notification => {
                notification.read = true;
            });
            state.totalUnread = 0;
        },
        
        deleteNotification: (state, action) => {
            const notificationId = action.payload;
            const index = state.notifications.findIndex(n => n.id === notificationId);
            
            if (index !== -1) {
                state.notifications.splice(index, 1);
                state.totalUnread = state.notifications.filter(n => !n.read).length;
            }
        },
        
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.totalUnread = 0;
        },
        
        // Supprimer les anciennes notifications (plus de 30 jours)
        cleanupOldNotifications: (state) => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            state.notifications = state.notifications.filter(notification => {
                const notificationDate = new Date(notification.timestamp);
                return notificationDate > thirtyDaysAgo;
            });
            
            state.totalUnread = state.notifications.filter(n => !n.read).length;
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
        
        // === ÉTAT DE CHARGEMENT ===
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        clearError: (state) => {
            state.error = null;
        },
        
        // === FILTRES ET TRI ===
        sortNotifications: (state, action) => {
            const sortBy = action.payload; // 'date', 'priority', 'type'
            
            switch (sortBy) {
                case 'date':
                    state.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    break;
                case 'priority':
                    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                    state.notifications.sort((a, b) => {
                        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
                    });
                    break;
                case 'type':
                    state.notifications.sort((a, b) => a.type.localeCompare(b.type));
                    break;
                default:
                    break;
            }
        },
        
        // === ACTIONS SPÉCIALES ===
        // Ajouter notification de commande
        addOrderNotification: (state, action) => {
            const { orderId, orderNumber, status, priority = 'high' } = action.payload;
            
            const notification = {
                id: `order_${orderId}_${Date.now()}`,
                type: 'order_update',
                title: `Commande #${orderNumber}`,
                message: `Statut mis à jour : ${status}`,
                timestamp: new Date().toISOString(),
                read: false,
                priority,
                actionUrl: `/orders/${orderId}`,
                icon: '📋',
                color: 'bg-blue-500',
                data: { orderId, orderNumber, status }
            };
            
            state.notifications.unshift(notification);
            state.totalUnread += 1;
        },
        
        // Ajouter notification de prix
        addPriceDropNotification: (state, action) => {
            const { productId, productName, oldPrice, newPrice, discountPercent } = action.payload;
            
            const notification = {
                id: `price_drop_${productId}_${Date.now()}`,
                type: 'price_drop',
                title: '🔥 Baisse de prix !',
                message: `${productName} : ${oldPrice}€ → ${newPrice}€ (-${discountPercent}%)`,
                timestamp: new Date().toISOString(),
                read: false,
                priority: 'medium',
                actionUrl: `/products/${productId}`,
                icon: '💰',
                color: 'bg-red-500',
                data: { productId, productName, oldPrice, newPrice, discountPercent }
            };
            
            state.notifications.unshift(notification);
            state.totalUnread += 1;
        },
        
        // Ajouter notification de stock
        addStockNotification: (state, action) => {
            const { productId, productName, type } = action.payload;
            
            const notification = {
                id: `stock_${type}_${productId}_${Date.now()}`,
                type: 'stock_alert',
                title: type === 'back_in_stock' ? '✨ Retour en stock !' : '⚠️ Stock faible',
                message: type === 'back_in_stock' 
                    ? `${productName} est de nouveau disponible`
                    : `Stock faible pour ${productName}`,
                timestamp: new Date().toISOString(),
                read: false,
                priority: type === 'back_in_stock' ? 'medium' : 'low',
                actionUrl: `/products/${productId}`,
                icon: '📦',
                color: type === 'back_in_stock' ? 'bg-green-500' : 'bg-orange-500',
                data: { productId, productName, type }
            };
            
            state.notifications.unshift(notification);
            state.totalUnread += 1;
        }
    }
});

// Create notificationActions object for backward compatibility
// Using notificationSlice.actions directly to avoid TDZ
const notificationActions = notificationSlice.actions;

// Re-export notificationActions for backward compatibility
export { notificationActions };

// Named exports for hooks
export const {
  setBasket,
  setMessage,
  incrementMessage,
  resetMessageCount,
  updateTotalUnread,
  addNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  updateSettings,
  toggleSetting,
  addOrderNotification,
  addPriceDropNotification,
  addStockNotification
} = notificationSlice.actions;

export default notificationSlice;
