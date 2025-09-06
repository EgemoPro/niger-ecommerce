import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageCircle } from 'lucide-react';

const NotificationBadge = ({ 
  type = 'notifications', // 'notifications' ou 'messages'
  className = "",
  showIcon = true,
  showCount = true,
  maxCount = 99,
  onClick
}) => {
  const notificationCount = useSelector(state => state.notifications.totalUnread || 0);
  const messageCount = useSelector(state => 
    state.messages.activeRooms.reduce((total, room) => total + (room.unreadCount || 0), 0)
  );
  
  const count = type === 'messages' ? messageCount : notificationCount;
  const hasUnread = count > 0;
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  
  const Icon = type === 'messages' ? MessageCircle : Bell;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative cursor-pointer ${className}`}
    >
      {showIcon && (
        <Icon 
          className={`w-6 h-6 transition-colors ${
            hasUnread ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`} 
        />
      )}
      
      <AnimatePresence>
        {hasUnread && showCount && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-medium shadow-lg"
          >
            <motion.span
              key={count} // Force re-render when count changes
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {displayCount}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Indicateur de pulsation pour les nouvelles notifications */}
      <AnimatePresence>
        {hasUnread && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            exit={{ scale: 0 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-75"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotificationBadge;
