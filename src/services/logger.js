// ============================================
// SERVICE DE LOGGING CENTRALISÉ
// ============================================

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  // ============================================
  // MÉTHODES DE BASE
  // ============================================

  debug(message, data = null) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  info(message, data = null) {
    console.info(`[INFO] ${message}`, data || '');
  }

  warn(message, data = null) {
    console.warn(`[WARN] ${message}`, data || '');
  }

  error(message, error = null) {
    console.error(`[ERROR] ${message}`, error || '');
    
    if (this.isProduction && error) {
      this.sendToErrorTracking(message, error);
    }
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - REDUX
  // ============================================

  logAction(actionType, payload = null) {
    if (this.isDevelopment) {
      this.debug(`Action dispatched: ${actionType}`, payload);
    }
  }

  logStateChange(sliceName, oldState, newState) {
    if (this.isDevelopment) {
      this.debug(`State changed in ${sliceName}`, {
        old: oldState,
        new: newState
      });
    }
  }

  logAsyncThunkStart(thunkName) {
    this.debug(`Async thunk started: ${thunkName}`);
  }

  logAsyncThunkSuccess(thunkName, result) {
    this.debug(`Async thunk succeeded: ${thunkName}`, result);
  }

  logAsyncThunkError(thunkName, error) {
    this.error(`Async thunk failed: ${thunkName}`, error);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - API
  // ============================================

  logApiRequest(method, url, data = null) {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  logApiResponse(method, url, status, data = null) {
    this.debug(`API Response: ${method} ${url} (${status})`, data);
  }

  logApiError(method, url, status, error) {
    this.error(`API Error: ${method} ${url} (${status})`, error);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - AUTHENTIFICATION
  // ============================================

  logLogin(email) {
    this.info(`User login: ${email}`);
  }

  logLogout(email) {
    this.info(`User logout: ${email}`);
  }

  logAuthError(error) {
    this.error('Authentication error', error);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - PANIER
  // ============================================

  logAddToCart(productId, quantity) {
    this.debug(`Product added to cart: ${productId} (qty: ${quantity})`);
  }

  logRemoveFromCart(productId) {
    this.debug(`Product removed from cart: ${productId}`);
  }

  logCartUpdate(totals) {
    this.debug('Cart updated', totals);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - NOTIFICATIONS
  // ============================================

  logNotificationAdded(notification) {
    this.debug('Notification added', {
      type: notification.type,
      priority: notification.priority
    });
  }

  logNotificationRead(notificationId) {
    this.debug(`Notification marked as read: ${notificationId}`);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - SOCKET
  // ============================================

  logSocketConnect() {
    this.info('Socket connected');
  }

  logSocketDisconnect(reason) {
    this.warn(`Socket disconnected: ${reason}`);
  }

  logSocketError(error) {
    this.error('Socket error', error);
  }

  logSocketMessage(event, data) {
    this.debug(`Socket event: ${event}`, data);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - VALIDATION
  // ============================================

  logValidationError(schema, data, error) {
    this.warn(`Validation error in ${schema}`, {
      data,
      error: error.message
    });
  }

  logValidationSuccess(schema) {
    this.debug(`Validation success: ${schema}`);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - PERFORMANCE
  // ============================================

  logPerformance(operationName, duration) {
    if (duration > 1000) {
      this.warn(`Slow operation: ${operationName} took ${duration}ms`);
    } else {
      this.debug(`Operation: ${operationName} took ${duration}ms`);
    }
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES - ERREUR TRACKING
  // ============================================

  sendToErrorTracking(message, error) {
    // À implémenter avec Sentry ou autre service
    // Exemple :
    // Sentry.captureException(error, {
    //   tags: { message }
    // });
  }

  // ============================================
  // MÉTHODES UTILITAIRES
  // ============================================

  group(label) {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  table(data) {
    if (this.isDevelopment) {
      console.table(data);
    }
  }

  time(label) {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label) {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  // ============================================
  // MÉTHODE DE CONFIGURATION
  // ============================================

  configure(options = {}) {
    if (options.isDevelopment !== undefined) {
      this.isDevelopment = options.isDevelopment;
    }
    if (options.isProduction !== undefined) {
      this.isProduction = options.isProduction;
    }
  }
}

// Instance singleton
export const logger = new Logger();

// Export de la classe pour les tests
export default Logger;
