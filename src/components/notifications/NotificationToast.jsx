import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../../hooks/useSocket';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  MessageCircle, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Truck, 
  Star, 
  Gift, 
  Percent, 
  Heart,
  X,
  Check
} from 'lucide-react';
import { markAsRead, deleteNotification } from '../../redux/Slices/notificationSlice';

const NotificationToast = () => {
  const dispatch = useDispatch();
  const { notifications } = useSocket();
  
  // Récupérer les notifications non lues récentes
  const recentUnreadNotifications = useSelector(state => 
    state.notifications.notifications
      .filter(n => !n.read)
      .slice(0, 3) // Afficher maximum 3 notifications en même temps
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  );

  const getNotificationIcon = (type) => {
    const icons = {
      order_confirmed: Check,
      order_shipped: Truck,
      order_delivered: Package,
      payment_success: CreditCard,
      price_drop: Percent,
      stock_alert: Package,
      message: MessageCircle,
      promo: Gift,
      birthday: Gift,
      wishlist: Heart
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-blue-500',
      low: 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleDismiss = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  return (
    <>
      {/* Sonner Toaster pour les notifications système */}
      <Toaster 
        position="top-right"
        expand={true}
        richColors={true}
        closeButton={true}
        duration={4000}
      />

      {/* Notifications personnalisées en overlay */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        <AnimatePresence>
          {recentUnreadNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm"
                layout
              >
                <div className="flex items-start space-x-3">
                  {/* Icône */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`p-2 rounded-full ${notification.color || 'bg-blue-500'} flex-shrink-0`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </motion.div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {notification.title}
                      </h3>
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
                      >
                        Marquer comme lu
                      </button>
                      
                      {notification.actionUrl && (
                        <button
                          onClick={() => {
                            // Navigation vers l'URL d'action
                            console.log('Navigate to:', notification.actionUrl);
                            handleMarkAsRead(notification.id);
                          }}
                          className="text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-full transition-colors"
                        >
                          Voir
                        </button>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {/* Barre de progression pour l'auto-dismiss */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 10, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-1 ${notification.color || 'bg-blue-500'} rounded-b-lg`}
                  onAnimationComplete={() => handleDismiss(notification.id)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationToast;
