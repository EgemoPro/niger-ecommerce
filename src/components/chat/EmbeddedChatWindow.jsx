import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { useConversationSocket } from '../../hooks/useConversationSocket';
import { fetchMessages, sendMessage } from '../../redux/Slices/conversationsSlice';
import { conversationsSelectors } from '../../redux/Slices/conversationsSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const EmbeddedChatWindow = ({ 
  conversationId,
  roomId, // Legacy support
  roomType = 'user',
  recipient = null,
  className = ""
}) => {
  const dispatch = useDispatch();
  const actualConversationId = conversationId || roomId;
  
  // État depuis Redux
  const messages = useSelector(conversationsSelectors.selectMessages);
  const isLoadingMessages = useSelector(conversationsSelectors.selectIsLoadingMessages);
  const currentUser = useSelector((state) => state.auth?.user);
  const typingUsers = useSelector((state) =>
    conversationsSelectors.selectTypingUsers(state, actualConversationId)
  );

  // Hook Socket.IO pour la conversation
  const {
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
    markAsRead,
    isTyping: isUserTyping,
    isSocketConnected,
    typingUsers: socketTypingUsers
  } = useConversationSocket(actualConversationId);

  // État local
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Charger les messages au montage
  useEffect(() => {
    if (!actualConversationId) return;
    
    setIsLoadingInitial(true);
    dispatch(fetchMessages(actualConversationId, 1, 50))
      .then(() => {
        setIsLoadingInitial(false);
        // Marquer comme lus après le chargement
        setTimeout(() => markAsRead(), 500);
      })
      .catch(() => setIsLoadingInitial(false));
  }, [actualConversationId, dispatch, markAsRead]);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Focus sur l'input lors du montage
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleSendMessage = (messageText, type = 'text') => {
    if (!messageText.trim() || !isSocketConnected) return;

    // Envoyer via Socket.IO pour la synchronisation temps réel
    sendSocketMessage(messageText);
    
    setIsTyping(false);
    stopTyping();
  };

  const handleTyping = (isTypingNow) => {
    if (isTypingNow !== isTyping) {
      setIsTyping(isTypingNow);
      
      if (isTypingNow) {
        startTyping();
      } else {
        stopTyping();
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
    return isSocketConnected ? 'text-green-500' : 'text-red-500';
  };

  const getConnectionStatusText = () => {
    return isSocketConnected ? 'En ligne' : 'Hors ligne';
  };

  // Afficher l'indicateur de frappe si quelqu'un tape
  const showTypingIndicator = socketTypingUsers && socketTypingUsers.length > 0;
  const typingUserNames = socketTypingUsers?.map((u) => u.userName).join(', ') || '';

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
      {!isSocketConnected && (
        <div className="px-4 py-2 text-sm text-center border-b border-gray-200 bg-red-50 text-red-800">
          ⚠️ Connexion perdue - Tentative de reconnexion...
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {isLoadingInitial ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-sm">Chargement des messages...</div>
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              currentUserId={currentUser?.id}
              isLoading={isLoadingMessages}
            />
            
            {/* Indicateur de frappe */}
            <AnimatePresence>
              {showTypingIndicator && (
                <TypingIndicator 
                  userName={typingUserNames || 'Quelqu\'un'} 
                />
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-gray-200 bg-white">
        <MessageInput
          ref={inputRef}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          disabled={!isSocketConnected || isLoadingInitial}
          placeholder={
            isSocketConnected ? 
            `Écrivez votre message à ${getChatTitle()}...` : 
            'Connexion en cours...'
          }
        />
      </div>
    </div>
  );
};

export default EmbeddedChatWindow;
