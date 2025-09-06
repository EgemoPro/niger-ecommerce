import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Search,
  Users,
  Store,
  Clock,
  MoreVertical,
  Filter,
  X,
  Plus,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import EmbeddedChatWindow from '../../components/chat/EmbeddedChatWindow';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    isConnected,
    messages,
    getUnreadMessagesCount,
    getOnlineStatus,
    joinRoom,
    connect
  } = useSocket();

  // États locaux
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Données de test pour les vendeurs disponibles
  const [availableVendors] = useState([]);

  // Messages existants simulés
  const [existingChats] = useState([]);

  // Détection de l'écran mobile
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Connexion automatique si pas connecté
  useEffect(() => {
    if (user && !isConnected) {
      connect();
    }
  }, [user, isConnected, connect]);

  // Formatter la date du dernier message
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM', { locale: fr });
    }
  };

  // Filtrer les chats selon le terme de recherche et le type
  const filteredChats = existingChats.filter(chat => {
    const matchesSearch = chat.recipient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'vendors' && chat.type === 'vendor') ||
                         (filterType === 'support' && chat.type === 'support');
    
    return matchesSearch && matchesFilter;
  });

  // Démarrer une nouvelle conversation avec un vendeur
  const startChatWithVendor = (vendor) => {
    const roomId = `vendor-${vendor.id}-${user?.payload?.id || 'user'}`;
    const chatData = {
      roomId,
      type: 'vendor',
      recipient: {
        id: vendor.id,
        name: vendor.name,
        avatar: vendor.avatar,
        isOnline: vendor.isOnline
      }
    };
    
    setSelectedChat(chatData);
    setShowNewChatModal(false);
    
    // Rejoindre la room
    joinRoom(roomId, 'vendor');
  };

  // Sélectionner un chat existant
  const selectChat = (chat) => {
    setSelectedChat(chat);
  };

  // Fermer le chat sélectionné
  const closeChatWindow = () => {
    setSelectedChat(null);
  };

  // Interface mobile : retour à la liste
  const backToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">
              Messagerie
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isConnected && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Connexion...
              </Badge>
            )}
            {isConnected && (
              <Badge className="bg-green-100 text-green-600 border-green-200">
                En ligne
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-80px)]">
        {/* Sidebar - Liste des chats */}
        <div className={`${
          isMobileView && selectedChat ? 'hidden' : 'block'
        } w-full md:w-80 bg-white border-r border-gray-200 flex flex-col`}>
          
          {/* Recherche et filtres */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  Tous
                </Button>
                <Button
                  variant={filterType === 'vendors' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('vendors')}
                >
                  Vendeurs
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewChatModal(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 && searchTerm && (
              <div className="p-4 text-center text-gray-500">
                <p>Aucune conversation trouvée</p>
              </div>
            )}
            
            {filteredChats.length === 0 && !searchTerm && (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Aucune conversation</p>
                <p className="text-sm mb-4">Commencez à discuter avec nos vendeurs</p>
                <Button onClick={() => setShowNewChatModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle conversation
                </Button>
              </div>
            )}

            <AnimatePresence>
              {filteredChats.map((chat) => {
                const unreadCount = chat.unreadCount || 0;
                
                return (
                  <motion.div
                    key={chat.roomId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    onClick={() => selectChat(chat)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedChat?.roomId === chat.roomId ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={chat.recipient?.avatar} alt={chat.recipient?.name} />
                          <AvatarFallback>
                            {chat.recipient?.name?.[0]?.toUpperCase() || 'V'}
                          </AvatarFallback>
                        </Avatar>
                        {chat.recipient?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {chat.recipient?.name || 'Chat'}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {chat.lastMessageTime && (
                              <span className="text-xs text-gray-500">
                                {formatLastMessageTime(chat.lastMessageTime)}
                              </span>
                            )}
                            {unreadCount > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage || 'Aucun message'}
                          </p>
                          <Store className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Zone de chat principale */}
        <div className={`${
          isMobileView && !selectedChat ? 'hidden' : 'flex'
        } flex-1 flex flex-col bg-gray-50`}>
          
          {!selectedChat ? (
            // État vide
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                  Sélectionnez une conversation
                </h2>
                <p className="text-gray-500 mb-6">
                  Choisissez une conversation dans la liste ou créez-en une nouvelle
                </p>
                <Button onClick={() => setShowNewChatModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle conversation
                </Button>
              </div>
            </div>
          ) : (
            // Chat sélectionné - Mobile: header avec retour
            <div className="flex-1 flex flex-col">
              {isMobileView && (
                <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={backToList}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChat.recipient?.avatar} alt={selectedChat.recipient?.name} />
                    <AvatarFallback>
                      {selectedChat.recipient?.name?.[0]?.toUpperCase() || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {selectedChat.recipient?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.recipient?.isOnline ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex-1 p-4">
                <EmbeddedChatWindow
                  roomId={selectedChat.roomId}
                  roomType={selectedChat.type}
                  recipient={selectedChat.recipient}
                  className="h-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Nouvelle conversation */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Nouvelle conversation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewChatModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Choisissez un vendeur pour commencer une conversation
                </p>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {availableVendors.map((vendor) => (
                    <motion.div
                      key={vendor.id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      onClick={() => startChatWithVendor(vendor)}
                      className="p-3 rounded-lg border border-gray-200 cursor-pointer transition-colors hover:border-blue-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={vendor.avatar} alt={vendor.name} />
                            <AvatarFallback>
                              {vendor.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {vendor.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {vendor.name}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {vendor.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {vendor.category}
                            </Badge>
                            {vendor.isOnline ? (
                              <span className="text-xs text-green-600">En ligne</span>
                            ) : (
                              <span className="text-xs text-gray-500">
                                Hors ligne
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
