import React, { useState, useReducer, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Truck, 
  Star, 
  Gift, 
  Percent, 
  Heart,
  Check, 
  X, 
  Filter,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  User
} from 'lucide-react';

// Simulation du store Redux pour les notifications client
const initialState = {
  notifications: [
    {
      id: 1,
      type: 'order_confirmed',
      title: 'Commande confirmée !',
      message: 'Votre commande #CMD-12345 a été confirmée et sera traitée sous 24h',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: 'high',
      icon: Check,
      color: 'bg-green-500',
      actionUrl: '/mes-commandes/12345'
    },
    {
      id: 2,
      type: 'payment_success',
      title: 'Paiement réussi',
      message: 'Paiement de 149,99€ effectué avec succès pour votre commande',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      priority: 'medium',
      icon: CreditCard,
      color: 'bg-blue-500',
      actionUrl: '/mes-commandes'
    },
    {
      id: 3,
      type: 'shipping',
      title: 'Votre colis est expédié !',
      message: 'Votre commande #CMD-12344 a été expédiée. Livraison prévue demain',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      priority: 'high',
      icon: Truck,
      color: 'bg-orange-500',
      actionUrl: '/suivi-commande/12344'
    },
    {
      id: 4,
      type: 'delivery',
      title: 'Colis livré !',
      message: 'Votre commande #CMD-12343 a été livrée. Merci pour votre achat !',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'medium',
      icon: Package,
      color: 'bg-green-600',
      actionUrl: '/avis-produit/12343'
    },
    {
      id: 5,
      type: 'promo',
      title: '🎉 Offre spéciale !',
      message: 'Réduction de 20% sur vos articles favoris. Valable jusqu\'à dimanche !',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      icon: Percent,
      color: 'bg-purple-500',
      actionUrl: '/promotions'
    },
    {
      id: 6,
      type: 'wishlist',
      title: 'Article en stock !',
      message: 'L\'iPhone 15 Pro de votre liste de souhaits est maintenant disponible',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      icon: Heart,
      color: 'bg-pink-500',
      actionUrl: '/wishlist'
    },
    {
      id: 7,
      type: 'price_drop',
      title: 'Baisse de prix !',
      message: 'MacBook Pro M3 : prix réduit de 200€ ! Ne manquez pas cette occasion',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true,
      priority: 'high',
      icon: Percent,
      color: 'bg-red-500',
      actionUrl: '/produit/macbook-pro-m3'
    },
    {
      id: 8,
      type: 'review_request',
      title: 'Donnez votre avis',
      message: 'Que pensez-vous de votre récent achat ? Partagez votre expérience',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: false,
      priority: 'low',
      icon: Star,
      color: 'bg-yellow-500',
      actionUrl: '/mes-avis'
    },
    {
      id: 9,
      type: 'birthday',
      title: 'Joyeux anniversaire ! 🎂',
      message: 'Profitez de votre cadeau d\'anniversaire : 15% de réduction',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'medium',
      icon: Gift,
      color: 'bg-indigo-500',
      actionUrl: '/mon-cadeau'
    }
  ],
  filter: 'all',
  settings: {
    orderUpdates: true,
    promotions: true,
    wishlistAlerts: true,
    priceDrops: true,
    emailNotifications: true,
    pushNotifications: true
  }
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    case 'MARK_AS_UNREAD':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: false } : notif
        )
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, read: true }))
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    default:
      return state;
  }
};

export default function Notifications() {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Simulation d'arrivée de nouvelles notifications client
  useEffect(() => {
    const interval = setInterval(() => {
      const customerNotifications = [
        {
          type: 'promo',
          title: '🔥 Vente Flash !',
          message: `Jusqu'à ${Math.floor(Math.random() * 50 + 20)}% de réduction sur une sélection`,
          icon: Percent,
          color: 'bg-red-500',
          actionUrl: '/promotions'
        },
        {
          type: 'shipping',
          title: 'Mise à jour livraison',
          message: 'Votre colis arrive plus tôt que prévu !',
          icon: Truck,
          color: 'bg-green-500',
          actionUrl: '/suivi-commande'
        },
        {
          type: 'wishlist',
          title: 'Retour en stock',
          message: 'Un article de votre wishlist est de nouveau disponible',
          icon: Heart,
          color: 'bg-pink-500',
          actionUrl: '/wishlist'
        },
        {
          type: 'price_drop',
          title: 'Prix en baisse',
          message: 'Un produit que vous suivez a baissé de prix !',
          icon: Percent,
          color: 'bg-blue-500',
          actionUrl: '/mes-alertes'
        }
      ];

      const randomNotif = customerNotifications[Math.floor(Math.random() * customerNotifications.length)];
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          ...randomNotif,
          timestamp: new Date(),
          read: false,
          priority: Math.random() > 0.7 ? 'high' : 'medium'
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getFilteredNotifications = () => {
    switch (state.filter) {
      case 'unread':
        return state.notifications.filter(n => !n.read);
      case 'orders':
        return state.notifications.filter(n => 
          ['order_confirmed', 'payment_success', 'shipping', 'delivery'].includes(n.type)
        );
      case 'promos':
        return state.notifications.filter(n => 
          ['promo', 'price_drop', 'birthday'].includes(n.type)
        );
      case 'wishlist':
        return state.notifications.filter(n => 
          ['wishlist', 'price_drop'].includes(n.type)
        );
      default:
        return state.notifications;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const getNotificationTypeLabel = (type) => {
    const labels = {
      order_confirmed: 'Commande',
      payment_success: 'Paiement',
      shipping: 'Expédition',
      delivery: 'Livraison',
      promo: 'Promotion',
      wishlist: 'Liste de souhaits',
      price_drop: 'Prix',
      review_request: 'Avis',
      birthday: 'Anniversaire'
    };
    return labels[type] || type;
  };

  const unreadCount = state.notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header avec profil utilisateur */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="relative"
              >
                <Bell className="w-8 h-8 text-blue-600" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.div>
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-gray-600" />
                <span className="text-sm text-gray-600">Bonjour, Marie</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mes Notifications</h1>
              <p className="text-gray-600">{unreadCount} nouvelles sur {state.notifications.length}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'MARK_ALL_READ' })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Tout marquer lu</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Filtres spécifiques client */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3 mt-4"
        >
          <Filter className="w-4 h-4 text-gray-500" />
          {[
            { key: 'all', label: 'Toutes', icon: Bell },
            { key: 'unread', label: 'Non lues', icon: Eye },
            { key: 'orders', label: 'Commandes', icon: ShoppingCart },
            { key: 'promos', label: 'Promos', icon: Percent },
            { key: 'wishlist', label: 'Favoris', icon: Heart }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: key })}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
                state.filter === key
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Panneau des paramètres */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6 overflow-hidden"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Préférences de notification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(state.settings).map(([key, value]) => {
                const labels = {
                  orderUpdates: 'Mises à jour commandes',
                  promotions: 'Offres promotionnelles',
                  wishlistAlerts: 'Alertes liste de souhaits',
                  priceDrops: 'Baisses de prix',
                  emailNotifications: 'Notifications par email',
                  pushNotifications: 'Notifications push'
                };
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{labels[key]}</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => dispatch({
                        type: 'UPDATE_SETTINGS',
                        payload: { [key]: !value }
                      })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: value ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-md"
                      />
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des notifications */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => {
            const IconComponent = notification.icon;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl p-4 cursor-pointer transition-all ${
                  !notification.read ? 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white' : ''
                }`}
                onClick={() => {
                  if (!notification.read) {
                    dispatch({ type: 'MARK_AS_READ', payload: notification.id });
                  }
                  setSelectedNotification(notification);
                }}
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-3 rounded-full ${notification.color} flex-shrink-0`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeAgo(notification.timestamp)}
                        </span>
                        <div className="flex space-x-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch({
                                type: notification.read ? 'MARK_AS_UNREAD' : 'MARK_AS_READ',
                                payload: notification.id
                              });
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {notification.read ? 
                              <EyeOff className="w-4 h-4 text-gray-500" /> : 
                              <Eye className="w-4 h-4 text-blue-500" />
                            }
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch({ type: 'DELETE_NOTIFICATION', payload: notification.id });
                            }}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                      {notification.actionUrl && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Ici vous pourriez naviguer vers l'URL
                            console.log('Navigate to:', notification.actionUrl);
                          }}
                          className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                        >
                          <span>Voir</span>
                          <MapPin className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal de détails */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedNotification(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Détails</h2>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full ${selectedNotification.color}`}>
                    <selectedNotification.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedNotification.title}</h3>
                    <p className="text-sm text-gray-600">{selectedNotification.message}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>📅 {selectedNotification.timestamp.toLocaleString()}</p>
                  <p>🏷️ {getNotificationTypeLabel(selectedNotification.type)}</p>
                  <p>⚡ Priorité: {selectedNotification.priority}</p>
                </div>
                
                <div className="flex space-x-3">
                  {selectedNotification.actionUrl && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        console.log('Navigate to:', selectedNotification.actionUrl);
                        setSelectedNotification(null);
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Voir les détails
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      dispatch({ type: 'DELETE_NOTIFICATION', payload: selectedNotification.id });
                      setSelectedNotification(null);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message si aucune notification */}
      {filteredNotifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune notification</h3>
          <p className="text-gray-500">Vous êtes à jour avec vos notifications !</p>
        </motion.div>
      )}
    </div>
  );
}