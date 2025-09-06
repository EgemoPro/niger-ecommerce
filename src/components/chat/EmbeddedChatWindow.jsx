import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  X,
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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const EmbeddedChatWindow = ({ 
  roomId, 
  roomType = 'user',
  recipient = null,
  className = ""
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

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Messages de la room courante
  const currentMessages = messages.messagesByRoom[roomId] || [];
  const unreadCount = getUnreadMessagesCount(roomId);
  const isRecipientOnline = recipient?.id ? getOnlineStatus(recipient.id) : false;
  const showTyping = isUserTyping(roomId, recipient?.id);

  // Rejoindre la room lors du montage
  useEffect(() => {
    if (roomId && isConnected) {
      joinRoom(roomId, roomType);
    }
    
    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId, roomType, isConnected, joinRoom, leaveRoom]);

  // Marquer les messages comme lus
  useEffect(() => {
    if (currentMessages.length > 0) {
      markRoomMessagesAsRead(roomId);
    }
  }, [currentMessages.length, roomId, markRoomMessagesAsRead]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  // Focus sur l'input lors du montage
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

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

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': 
        return isRecipientOnline ? 'En ligne' : 'Hors ligne';
      case 'connecting': 
        return 'Connexion...';
      case 'reconnecting': 
        return 'Reconnexion...';
      default: 
        return 'Déconnecté';
    }
  };

  return (
    <div className={`h-full bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          {recipient?.avatar ? (
            <Avatar className="w-10 h-10">
              <AvatarImage src={recipient.avatar} alt={recipient.name} />
              <AvatarFallback>
                {recipient.name?.[0]?.toUpperCase() || 'V'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-lg">{getChatTitle()}</h3>
            <div className="flex items-center space-x-1 text-sm opacity-90">
              <Circle 
                className={`w-2 h-2 ${getConnectionStatusColor()}`} 
                fill="currentColor" 
              />
              <span>{getConnectionStatusText()}</span>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-medium"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {roomType === 'store' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Video className="w-4 h-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Zone de statut de connexion */}
      {connectionStatus !== 'connected' && (
        <div className={`px-4 py-2 text-sm text-center border-b border-gray-200 ${
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
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
      <div className="border-t border-gray-200 bg-white">
        <MessageInput
          ref={inputRef}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          disabled={!isConnected}
          placeholder={
            isConnected ? 
            `Écrivez votre message à ${getChatTitle()}...` : 
            'Connexion en cours...'
          }
        />
      </div>
    </div>
  );
};

export default EmbeddedChatWindow;
