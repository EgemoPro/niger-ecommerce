import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  X,
  Minimize2,
  Users,
  Phone,
  Video,
  Settings,
  Circle,
  MoreVertical
} from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import OnlineStatus from './OnlineStatus';

const ChatWindow = ({ 
  isOpen, 
  onClose, 
  onMinimize,
  roomId, 
  roomType = 'user',
  recipient = null 
}) => {
  const {
    isConnected,
    connectionStatus,
    sendMessage,
    joinRoom,
    leaveRoom,
    markRoomMessagesAsRead,
    startTyping,
    stopTyping,
    getUnreadMessagesCount,
    messages,
    getOnlineStatus,
    isUserTyping,
    currentUserId
  } = useSocket();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Messages de la room courante
  const currentMessages = messages.messagesByRoom[roomId] || [];
  const unreadCount = getUnreadMessagesCount(roomId);
  const isRecipientOnline = recipient?.id ? getOnlineStatus(recipient.id) : false;
  const showTyping = isUserTyping(roomId, recipient?.id);

  // Rejoindre la room lors de l'ouverture
  useEffect(() => {
    if (isOpen && roomId && isConnected) {
      joinRoom(roomId, roomType);
    }
    
    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [isOpen, roomId, roomType, isConnected, joinRoom, leaveRoom]);

  // Marquer les messages comme lus lors de l'ouverture
  useEffect(() => {
    if (isOpen && !isMinimized && currentMessages.length > 0) {
      markRoomMessagesAsRead(roomId);
    }
  }, [isOpen, isMinimized, currentMessages.length, roomId, markRoomMessagesAsRead]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  // Focus sur l'input lors de l'ouverture
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (message, type = 'text') => {
    if (!message.trim() || !isConnected) return;

    sendMessage(roomId, message, recipient?.id);
    setIsTyping(false);
    stopTyping(roomId);
  };

  const handleTyping = (isTypingNow) => {
    if (isTypingNow !== isTyping) {
      setIsTyping(isTypingNow);
      
      if (isTypingNow) {
        startTyping(roomId);
      } else {
        stopTyping(roomId);
      }
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (onMinimize) onMinimize(!isMinimized);
  };

  const handleClose = () => {
    if (roomId) {
      leaveRoom(roomId);
    }
    if (onClose) onClose();
  };

  // Titre de la fenêtre de chat
  const getChatTitle = () => {
    if (recipient) {
      return recipient.name || recipient.username || 'Chat';
    }
    
    if (roomType === 'store') {
      return 'Support Boutique';
    } else if (roomType === 'order') {
      return 'Chat Commande';
    }
    
    return 'Chat';
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'reconnecting': return 'text-orange-500';
      default: return 'text-red-500';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: isMinimized ? 'auto' : 500
      }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {recipient?.avatar ? (
            <img 
              src={recipient.avatar} 
              alt={recipient.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-sm">{getChatTitle()}</h3>
            <div className="flex items-center space-x-1 text-xs opacity-90">
              <Circle className={`w-2 h-2 ${getConnectionStatusColor()}`} fill="currentColor" />
              <span>
                {connectionStatus === 'connected' ? (
                  isRecipientOnline ? 'En ligne' : 'Hors ligne'
                ) : (
                  connectionStatus === 'connecting' ? 'Connexion...' : 
                  connectionStatus === 'reconnecting' ? 'Reconnexion...' : 'Déconnecté'
                )}
              </span>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {roomType === 'store' && (
            <>
              <button className="p-1 hover:bg-white/20 rounded">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-white/20 rounded">
                <Video className="w-4 h-4" />
              </button>
            </>
          )}
          
          <button 
            onClick={handleMinimize}
            className="p-1 hover:bg-white/20 rounded"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Corps du chat - Minimisé */}
      {isMinimized && (
        <div className="p-3 bg-gray-50 border-t">
          <div className="text-sm text-gray-600 text-center">
            Chat minimisé • {currentMessages.length} messages
            {unreadCount > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Corps du chat - Ouvert */}
      {!isMinimized && (
        <>
          {/* Zone de statut de connexion */}
          {connectionStatus !== 'connected' && (
            <div className={`px-4 py-2 text-sm text-center ${
              connectionStatus === 'connecting' ? 'bg-yellow-50 text-yellow-800' :
              connectionStatus === 'reconnecting' ? 'bg-orange-50 text-orange-800' :
              'bg-red-50 text-red-800'
            }`}>
              {connectionStatus === 'connecting' && '🔄 Connexion au chat...'}
              {connectionStatus === 'reconnecting' && '🔄 Reconnexion en cours...'}
              {connectionStatus === 'error' && '❌ Erreur de connexion'}
              {connectionStatus === 'disconnected' && '⚠️ Déconnecté du chat'}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-[300px] max-h-[300px]">
            <MessageList
              messages={currentMessages}
              currentUserId={currentUserId}
              isLoading={!isConnected}
            />
            
            {/* Indicateur de frappe */}
            <AnimatePresence>
              {showTyping && (
                <TypingIndicator 
                  userName={recipient?.name || 'Quelqu\'un'} 
                />
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <MessageInput
              ref={inputRef}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              disabled={!isConnected}
              placeholder={
                isConnected ? 
                `Écrivez votre message...` : 
                'Connexion en cours...'
              }
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatWindow;
