import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  addNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  cleanupOldNotifications,
  setBasket,
  setMessage,
  incrementMessage,
  resetMessageCount,
  updateTotalUnread,
  updateSettings,
  toggleSetting,
  addOrderNotification,
  addPriceDropNotification,
  addStockNotification
} from '../redux/Slices/notificationSlice';
import { logger } from '../services/logger';

// ============================================
// HOOK PERSONNALISÉ - NOTIFICATIONS
// ============================================

export const useNotifications = () => {
  const dispatch = useDispatch();
  
  // Sélecteurs
  const notifications = useSelector(state => state.notifications.notifications);
  const basket = useSelector(state => state.notifications.basket);
  const message = useSelector(state => state.notifications.message);
  const totalUnread = useSelector(state => state.notifications.totalUnread);
  const settings = useSelector(state => state.notifications.settings);
  const loading = useSelector(state => state.notifications.loading);
  const error = useSelector(state => state.notifications.error);

  // Actions - Notifications
  const add = useCallback((notification) => {
    try {
      if (!notification || !notification.type) {
        logger.warn('Invalid notification for add', { notification });
        return false;
      }
      
      dispatch(addNotification(notification));
      logger.logNotificationAdded(notification);
      return true;
    } catch (err) {
      logger.error('Error in add notification', err);
      return false;
    }
  }, [dispatch]);

  const markRead = useCallback((notificationId) => {
    try {
      if (!notificationId) {
        logger.warn('Invalid notificationId for markRead', { notificationId });
        return false;
      }
      
      dispatch(markAsRead(notificationId));
      logger.logNotificationRead(notificationId);
      return true;
    } catch (err) {
      logger.error('Error in markRead', err);
      return false;
    }
  }, [dispatch]);

  const markUnread = useCallback((notificationId) => {
    try {
      dispatch(markAsUnread(notificationId));
      logger.debug('Notification marked as unread', { notificationId });
      return true;
    } catch (err) {
      logger.error('Error in markUnread', err);
      return false;
    }
  }, [dispatch]);

  const markAllRead = useCallback(() => {
    try {
      dispatch(markAllAsRead());
      logger.debug('All notifications marked as read');
      return true;
    } catch (err) {
      logger.error('Error in markAllRead', err);
      return false;
    }
  }, [dispatch]);

  const remove = useCallback((notificationId) => {
    try {
      dispatch(deleteNotification(notificationId));
      logger.debug('Notification deleted', { notificationId });
      return true;
    } catch (err) {
      logger.error('Error in remove notification', err);
      return false;
    }
  }, [dispatch]);

  const clearAll = useCallback(() => {
    try {
      dispatch(clearAllNotifications());
      logger.debug('All notifications cleared');
      return true;
    } catch (err) {
      logger.error('Error in clearAll', err);
      return false;
    }
  }, [dispatch]);

  const cleanup = useCallback((daysOld = 30) => {
    try {
      dispatch(cleanupOldNotifications());
      logger.debug(`Notifications older than ${daysOld} days cleaned up`);
      return true;
    } catch (err) {
      logger.error('Error in cleanup', err);
      return false;
    }
  }, [dispatch]);

  // Actions - Compteurs
  const setBasketCount = useCallback((count) => {
    try {
      if (typeof count !== 'number' || count < 0) {
        logger.warn('Invalid basket count', { count });
        return false;
      }
      
      dispatch(setBasket(count));
      return true;
    } catch (err) {
      logger.error('Error in setBasketCount', err);
      return false;
    }
  }, [dispatch]);

  const setMessageCount = useCallback((count) => {
    try {
      if (typeof count !== 'number' || count < 0) {
        logger.warn('Invalid message count', { count });
        return false;
      }
      
      dispatch(setMessage(count));
      return true;
    } catch (err) {
      logger.error('Error in setMessageCount', err);
      return false;
    }
  }, [dispatch]);

  const incrementMessageCount = useCallback(() => {
    try {
      dispatch(incrementMessage());
      return true;
    } catch (err) {
      logger.error('Error in incrementMessageCount', err);
      return false;
    }
  }, [dispatch]);

  const resetMessageCountAction = useCallback(() => {
    try {
      dispatch(resetMessageCount());
      return true;
    } catch (err) {
      logger.error('Error in resetMessageCountAction', err);
      return false;
    }
  }, [dispatch]);

  const updateUnreadCount = useCallback(() => {
    try {
      dispatch(updateTotalUnread());
      return true;
    } catch (err) {
      logger.error('Error in updateUnreadCount', err);
      return false;
    }
  }, [dispatch]);

  // Actions - Paramètres
  const updateNotificationSettings = useCallback((newSettings) => {
    try {
      dispatch(updateSettings(newSettings));
      logger.debug('Notification settings updated', newSettings);
      return true;
    } catch (err) {
      logger.error('Error in updateNotificationSettings', err);
      return false;
    }
  }, [dispatch]);

  const toggleNotificationSetting = useCallback((settingKey) => {
    try {
      dispatch(toggleSetting(settingKey));
      logger.debug('Notification setting toggled', { settingKey });
      return true;
    } catch (err) {
      logger.error('Error in toggleNotificationSetting', err);
      return false;
    }
  }, [dispatch]);

  // Actions - Notifications spécialisées
  const addOrder = useCallback((orderData) => {
    try {
      dispatch(addOrderNotification(orderData));
      logger.debug('Order notification added', orderData);
      return true;
    } catch (err) {
      logger.error('Error in addOrder notification', err);
      return false;
    }
  }, [dispatch]);

  const addPriceDrop = useCallback((priceData) => {
    try {
      dispatch(addPriceDropNotification(priceData));
      logger.debug('Price drop notification added', priceData);
      return true;
    } catch (err) {
      logger.error('Error in addPriceDrop notification', err);
      return false;
    }
  }, [dispatch]);

  const addStock = useCallback((stockData) => {
    try {
      dispatch(addStockNotification(stockData));
      logger.debug('Stock notification added', stockData);
      return true;
    } catch (err) {
      logger.error('Error in addStock notification', err);
      return false;
    }
  }, [dispatch]);

  // Utilitaires
  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const getNotificationById = useCallback((id) => {
    return notifications.find(n => n.id === id);
  }, [notifications]);

  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  return {
    // État
    notifications,
    basket,
    message,
    totalUnread,
    settings,
    loading,
    error,
    
    // Actions - Notifications
    add,
    markRead,
    markUnread,
    markAllRead,
    remove,
    clearAll,
    cleanup,
    
    // Actions - Compteurs
    setBasketCount,
    setMessageCount,
    incrementMessageCount,
    resetMessageCountAction,
    updateUnreadCount,
    
    // Actions - Paramètres
    updateNotificationSettings,
    toggleNotificationSetting,
    
    // Actions - Spécialisées
    addOrder,
    addPriceDrop,
    addStock,
    
    // Utilitaires
    getUnreadCount,
    getNotificationById,
    getNotificationsByType,
    getUnreadNotifications,
    
    // Propriétés calculées
    hasUnread: totalUnread > 0,
    unreadCount: totalUnread
  };
};

export default useNotifications;
