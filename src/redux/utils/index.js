import { logger } from '../../services/logger';
import { safeValidate } from '../schemas/index';

// ============================================
// UTILITAIRES DE CALCUL - PANIER
// ============================================

export const calculateCartTotals = (items) => {
  try {
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    
    return {
      totalItems: Math.max(0, totalItems),
      totalPrice: Math.max(0, totalPrice)
    };
  } catch (error) {
    logger.error('Error calculating cart totals', error);
    return { totalItems: 0, totalPrice: 0 };
  }
};

export const findProductInCart = (items, productId) => {
  return items.find(item => item.id === productId);
};

export const updateProductQuantity = (items, productId, quantity) => {
  return items.map(item => 
    item.id === productId 
      ? { ...item, quantity: Math.max(0, quantity) }
      : item
  ).filter(item => item.quantity > 0);
};

export const removeProductFromCart = (items, productId) => {
  return items.filter(item => item.id !== productId);
};

// ============================================
// UTILITAIRES DE CALCUL - NOTIFICATIONS
// ============================================

export const calculateUnreadCount = (notifications) => {
  try {
    return notifications.filter(n => !n.read).length;
  } catch (error) {
    logger.error('Error calculating unread count', error);
    return 0;
  }
};

export const sortNotificationsByDate = (notifications) => {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB - dateA;
  });
};

export const sortNotificationsByPriority = (notifications) => {
  const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
  return [...notifications].sort((a, b) => {
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });
};

export const filterNotificationsByType = (notifications, type) => {
  return notifications.filter(n => n.type === type);
};

export const cleanupOldNotifications = (notifications, daysOld = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return notifications.filter(notification => {
    const notificationDate = new Date(notification.timestamp);
    return notificationDate > cutoffDate;
  });
};

// ============================================
// UTILITAIRES DE GESTION D'ERREUR
// ============================================

export const createErrorObject = (message, code = null, details = null) => {
  return {
    message,
    code,
    timestamp: new Date().toISOString(),
    details
  };
};

export const extractErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Une erreur est survenue';
};

export const extractErrorCode = (error) => {
  return error?.response?.status || error?.code || null;
};

// ============================================
// UTILITAIRES DE VALIDATION
// ============================================

export const validateAndSanitize = (schema, data) => {
  try {
    const validated = schema.parse(data);
    logger.debug('Data validated successfully', { dataType: schema.name });
    return { success: true, data: validated, error: null };
  } catch (error) {
    logger.warn('Validation failed', { error: error.message });
    return { success: false, data: null, error: error.errors || error.message };
  }
};

export const validatePayload = (schema, payload, actionName) => {
  const result = validateAndSanitize(schema, payload);
  
  if (!result.success) {
    logger.error(`Invalid payload for ${actionName}`, result.error);
  }
  
  return result;
};

// ============================================
// UTILITAIRES DE NORMALISATION
// ============================================

export const normalizeNotifications = (notifications) => {
  const byId = {};
  const allIds = [];
  
  notifications.forEach(notification => {
    byId[notification.id] = notification;
    allIds.push(notification.id);
  });
  
  return { byId, allIds };
};

export const denormalizeNotifications = (normalized) => {
  return normalized.allIds.map(id => normalized.byId[id]);
};

export const normalizeMessages = (messages) => {
  const byId = {};
  const allIds = [];
  
  messages.forEach(message => {
    byId[message.id] = message;
    allIds.push(message.id);
  });
  
  return { byId, allIds };
};

export const denormalizeMessages = (normalized) => {
  return normalized.allIds.map(id => normalized.byId[id]);
};

// ============================================
// UTILITAIRES DE SÉLECTION
// ============================================

export const selectNotificationById = (notifications, id) => {
  return notifications.find(n => n.id === id);
};

export const selectUnreadNotifications = (notifications) => {
  return notifications.filter(n => !n.read);
};

export const selectNotificationsByPriority = (notifications, priority) => {
  return notifications.filter(n => n.priority === priority);
};

export const selectMessagesByRoom = (messages, roomId) => {
  return messages.filter(m => m.roomId === roomId);
};

export const selectProductInCart = (items, productId) => {
  return items.find(item => item.id === productId);
};

// ============================================
// UTILITAIRES DE TRANSFORMATION
// ============================================

export const transformNotificationForDisplay = (notification) => {
  return {
    ...notification,
    displayTime: new Date(notification.timestamp).toLocaleString('fr-FR'),
    isNew: !notification.read,
    priorityClass: `priority-${notification.priority}`
  };
};

export const transformMessageForDisplay = (message) => {
  return {
    ...message,
    displayTime: new Date(message.timestamp).toLocaleTimeString('fr-FR'),
    isOwn: false // À déterminer selon le contexte
  };
};

export const transformProductForCart = (product, quantity = 1) => {
  return {
    ...product,
    quantity,
    subtotal: product.price * quantity
  };
};

// ============================================
// UTILITAIRES - PANIER → COMMANDE API
// ============================================

/**
 * Transforme les items du panier pour l'API orders
 * @param {Array} basketItems - Items du panier Redux
 * @returns {Array} Items au format API
 */
export const transformBasketItemsForOrder = (basketItems) => {
  return basketItems.map(item => ({
    productId: item.id,
    title: item.name,
    sku: item.sku || '',
    image: item.image || '',
    price: item.price,
    quantity: item.quantity,
    attributes: item.attributes || {}
  }));
};

/**
 * Groupe les items du panier par storeId (une commande par boutique)
 * @param {Array} basketItems - Items du panier
 * @returns {Object} { storeId: [items] }
 */
export const groupBasketItemsByStore = (basketItems) => {
  const grouped = {};
  
  basketItems.forEach(item => {
    const storeId = item.storeId || 'default';
    if (!grouped[storeId]) {
      grouped[storeId] = [];
    }
    grouped[storeId].push(item);
  });
  
  return grouped;
};

/**
 * Prépare les données pour une commande API
 * @param {Array} basketItems - Items du panier
 * @param {Object} shippingAddress - Adresse de livraison
 * @param {string} paymentMethod - cash | mobile_money | stripe
 * @param {Object} options - { customerNote, shippingCost, tax, discount }
 * @returns {Object} Données prêtes pour POST /orders
 */
export const prepareOrderData = (basketItems, shippingAddress, paymentMethod, options = {}) => {
  const {
    customerNote = '',
    shippingCost = 0,
    tax = 0,
    discount = 0
  } = options;
  
  // Grouper par boutique (une commande par store)
  const groupedByStore = groupBasketItemsByStore(basketItems);
  
  // Prendre le premier store (pour l'instant on fait une seule commande)
  const storeIds = Object.keys(groupedByStore);
  const storeId = storeIds[0] || 'default';
  const items = transformBasketItemsForOrder(groupedByStore[storeId]);
  
  // Calculer les totaux
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost + tax - discount;
  
  return {
    storeId,
    items,
    shippingAddress,
    paymentMethod,
    customerNote,
    shippingCost,
    tax,
    discount,
    subtotal,
    total
  };
};

// ============================================
// UTILITAIRES DE COMPARAISON
// ============================================

export const hasNotificationChanged = (oldNotification, newNotification) => {
  return JSON.stringify(oldNotification) !== JSON.stringify(newNotification);
};

export const hasCartChanged = (oldCart, newCart) => {
  if (oldCart.length !== newCart.length) return true;
  
  return oldCart.some((item, index) => {
    const newItem = newCart[index];
    return item.id !== newItem.id || item.quantity !== newItem.quantity;
  });
};

// ============================================
// UTILITAIRES DE PAGINATION
// ============================================

export const paginateArray = (array, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: array.slice(startIndex, endIndex),
    page,
    pageSize,
    total: array.length,
    totalPages: Math.ceil(array.length / pageSize)
  };
};

// ============================================
// UTILITAIRES DE FILTRAGE
// ============================================

export const filterBySearchTerm = (items, searchTerm, searchFields = ['name']) => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    searchFields.some(field => 
      String(item[field]).toLowerCase().includes(term)
    )
  );
};

export const filterByDateRange = (items, startDate, endDate, dateField = 'timestamp') => {
  return items.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= startDate && itemDate <= endDate;
  });
};
