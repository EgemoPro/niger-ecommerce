import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Clock, Edit3 } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessageList = ({ messages, currentUserId, isLoading = false }) => {
  
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (isYesterday(date)) {
      return 'Hier ' + format(date, 'HH:mm', { locale: fr });
    } else {
      return format(date, 'dd/MM HH:mm', { locale: fr });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: date,
          messages: []
        };
      }
      
      groups[dateKey].messages.push(message);
    });
    
    return Object.values(groups).sort((a, b) => a.date - b.date);
  };

  const getDateSeparatorLabel = (date) => {
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💬
          </motion.div>
        </div>
        <p className="text-center">
          Aucun message pour le moment.<br />
          <span className="text-sm">Commencez la conversation !</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {messageGroups.map((group, groupIndex) => (
          <div key={group.date.toISOString()}>
            {/* Séparateur de date */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center my-4"
            >
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                {getDateSeparatorLabel(group.date)}
              </div>
            </motion.div>

            {/* Messages du groupe */}
            <div className="space-y-2">
              {group.messages.map((message, messageIndex) => {
                const isOwnMessage = message.sender === currentUserId;
                const showAvatar = !isOwnMessage;
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3,
                      delay: (groupIndex * group.messages.length + messageIndex) * 0.05 
                    }}
                    className={`flex items-end space-x-2 ${
                      isOwnMessage ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Avatar pour les messages reçus */}
                    {showAvatar && (
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {message.senderName ? message.senderName[0]?.toUpperCase() : '?'}
                      </div>
                    )}

                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative group ${
                        isOwnMessage
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      {/* Nom de l'expéditeur pour les messages reçus */}
                      {!isOwnMessage && message.senderName && (
                        <div className="text-xs text-gray-500 mb-1 font-medium">
                          {message.senderName}
                        </div>
                      )}

                      {/* Contenu du message */}
                      <div className="break-words">
                        {message.type === 'text' ? (
                          <span className="whitespace-pre-wrap">{message.message}</span>
                        ) : message.type === 'image' ? (
                          <div>
                            <img 
                              src={message.message} 
                              alt="Image partagée"
                              className="rounded-lg max-w-full h-auto"
                            />
                          </div>
                        ) : message.type === 'file' ? (
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gray-100 rounded">
                              📎
                            </div>
                            <span className="text-sm">{message.fileName || 'Fichier'}</span>
                          </div>
                        ) : (
                          <span>{message.message}</span>
                        )}
                      </div>

                      {/* Métadonnées du message */}
                      <div
                        className={`flex items-center justify-between mt-1 text-xs ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{formatMessageTime(message.timestamp)}</span>
                          {message.edited && (
                            <>
                              <span>•</span>
                              <Edit3 className="w-3 h-3" />
                              <span>modifié</span>
                            </>
                          )}
                        </div>

                        {/* Indicateur de lecture pour les messages envoyés */}
                        {isOwnMessage && (
                          <div className="flex items-center ml-2">
                            {message.delivered ? (
                              message.read ? (
                                <CheckCheck className="w-4 h-4 text-blue-200" />
                              ) : (
                                <Check className="w-4 h-4 text-blue-200" />
                              )
                            ) : (
                              <Clock className="w-3 h-3 text-blue-200" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Indicateur de non lu pour les messages reçus */}
                      {!isOwnMessage && !message.read && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -right-1 -top-1 w-3 h-3 bg-blue-500 rounded-full"
                        />
                      )}
                    </div>

                    {/* Espace pour l'avatar des messages envoyés */}
                    {isOwnMessage && <div className="w-6" />}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
