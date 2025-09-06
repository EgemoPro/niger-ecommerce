import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

const MessageInput = forwardRef(({ 
  onSendMessage, 
  onTyping, 
  disabled = false, 
  placeholder = "Écrivez votre message..." 
}, ref) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  // Gérer la frappe
  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Auto-resize
    adjustTextareaHeight();
    
    // Gestion de l'indicateur de frappe
    const isCurrentlyTyping = value.length > 0;
    
    if (isCurrentlyTyping !== isTyping) {
      setIsTyping(isCurrentlyTyping);
      if (onTyping) onTyping(isCurrentlyTyping);
    }
    
    // Reset du timeout de frappe
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Arrêter l'indicateur après 2 secondes d'inactivité
    if (isCurrentlyTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (onTyping) onTyping(false);
      }, 2000);
    }
  };

  // Gérer l'envoi
  const handleSend = () => {
    if (!message.trim() || disabled) return;
    
    if (onSendMessage) {
      onSendMessage(message.trim());
    }
    
    setMessage('');
    setIsTyping(false);
    if (onTyping) onTyping(false);
    
    // Reset du textarea
    setTimeout(() => {
      adjustTextareaHeight();
      textareaRef.current?.focus();
    }, 0);
  };

  // Gérer les touches
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Focus sur le textarea lors du montage
  useEffect(() => {
    if (ref) {
      ref.current = textareaRef.current;
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [ref]);

  return (
    <div className="flex items-end space-x-2 p-3 border-t border-gray-200 bg-white">
      {/* Bouton fichier */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        disabled={disabled}
        title="Joindre un fichier"
        onClick={() => {
          // TODO: Implémenter l'upload de fichiers
          console.log('Upload de fichier à implémenter');
        }}
      >
        <Paperclip className="w-5 h-5" />
      </motion.button>

      {/* Zone de saisie */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[40px] max-h-[120px]"
          rows={1}
        />
        
        {/* Bouton emoji */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700 rounded transition-colors disabled:opacity-50"
          disabled={disabled}
          title="Ajouter un emoji"
        >
          <Smile className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Bouton d'envoi */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
          message.trim() && !disabled
            ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600 hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        title="Envoyer le message"
      >
        <Send className="w-5 h-5" />
      </motion.button>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
