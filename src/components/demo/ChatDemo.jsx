import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Wifi, 
  WifiOff,
  Play,
  Square,
  TestTube,
  Users,
  Store,
  ShoppingCart
} from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import ChatWindow from '../chat/ChatWindow';
import { toast } from 'sonner';

const ChatDemo = () => {
  const {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    getUnreadMessagesCount,
    messages
  } = useSocket();

  const [testRoomId, setTestRoomId] = useState('demo-vendor-123-user-456');
  const [testMessage, setTestMessage] = useState('Bonjour ! Ce produit est-il disponible ?');
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  // Données de test pour les vendeurs
  const testVendors = [
    {
      id: 'vendor-1',
      name: 'Boutique Afrique Mode',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      category: 'Mode'
    },
    {
      id: 'vendor-2',
      name: 'Tech Niger Plus',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      category: 'Électronique'
    }
  ];

  // Test de connexion
  const testConnection = () => {
    if (isConnected) {
      disconnect();
      toast.info('Déconnecté du chat');
    } else {
      connect();
      toast.success('Connexion au chat...');
    }
  };

  // Test rejoindre room
  const testJoinRoom = () => {
    if (!isConnected) {
      toast.error('Connectez-vous d\'abord !');
      return;
    }
    
    joinRoom(testRoomId, 'vendor');
    toast.success(`Rejoint la room: ${testRoomId}`);
  };

  // Test envoyer message
  const testSendMessage = () => {
    if (!isConnected) {
      toast.error('Connectez-vous d\'abord !');
      return;
    }
    
    if (!testMessage.trim()) {
      toast.error('Entrez un message !');
      return;
    }
    
    sendMessage(testRoomId, testMessage, 'vendor-1');
    toast.success('Message envoyé !');
    setTestMessage('');
  };

  // Démo automatique
  const runDemo = async () => {
    setDemoRunning(true);
    
    try {
      // Étape 1: Connexion
      toast.info('🔌 Connexion au socket...');
      if (!isConnected) {
        connect();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Étape 2: Rejoindre room
      toast.info('🏠 Rejoindre la conversation...');
      joinRoom(testRoomId, 'vendor');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Étape 3: Envoyer message
      toast.info('💬 Envoi du message de test...');
      sendMessage(testRoomId, 'Message de démonstration automatique !', 'vendor-1');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Étape 4: Ouvrir fenêtre de chat
      toast.success('✅ Ouverture du chat !');
      setShowChatWindow(true);
      
    } catch (error) {
      console.error('Erreur pendant la démo:', error);
      toast.error('Erreur pendant la démo');
    } finally {
      setDemoRunning(false);
    }
  };

  // Statistiques
  const stats = {
    activeRooms: messages?.activeRooms?.length || 0,
    totalMessages: Object.keys(messages?.messagesByRoom || {}).length,
    unreadCount: getUnreadMessagesCount()
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔌 Démo Chat & Socket System
        </h1>
        <p className="text-gray-600">
          Testez le système de chat en temps réel Niger E-commerce
        </p>
      </div>

      {/* Statut de connexion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span>Statut de Connexion</span>
            <Badge 
              className={isConnected ? 'bg-green-500' : 'bg-red-500'}
            >
              {connectionStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.activeRooms}</div>
              <div className="text-sm text-blue-800">Rooms actives</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.totalMessages}</div>
              <div className="text-sm text-green-800">Messages en mémoire</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.unreadCount}</div>
              <div className="text-sm text-purple-800">Messages non lus</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions de test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tests manuels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="w-5 h-5" />
              <span>Tests Manuels</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Connexion */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={testConnection}
                variant={isConnected ? 'destructive' : 'default'}
                className="flex items-center space-x-2"
              >
                {isConnected ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                <span>{isConnected ? 'Déconnecter' : 'Connecter'}</span>
              </Button>
              <Badge variant={isConnected ? 'default' : 'outline'}>
                {isConnected ? 'Connecté' : 'Déconnecté'}
              </Badge>
            </div>

            {/* Room ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Room ID de test:</label>
              <Input
                value={testRoomId}
                onChange={(e) => setTestRoomId(e.target.value)}
                placeholder="demo-vendor-123-user-456"
              />
              <Button
                onClick={testJoinRoom}
                disabled={!isConnected}
                variant="outline"
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Rejoindre Room
              </Button>
            </div>

            {/* Message de test */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message de test:</label>
              <div className="flex space-x-2">
                <Input
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      testSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={testSendMessage}
                  disabled={!isConnected || !testMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Démo automatique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Démo Automatique</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Lance une démonstration complète du système de chat :
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Connexion au socket</li>
              <li>• Rejoindre une room</li>
              <li>• Envoyer un message</li>
              <li>• Ouvrir la fenêtre de chat</li>
            </ul>
            
            <Button
              onClick={runDemo}
              disabled={demoRunning}
              className="w-full"
            >
              {demoRunning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="ml-2">
                {demoRunning ? 'Démo en cours...' : 'Lancer la Démo'}
              </span>
            </Button>

            {/* Bouton Chat Window */}
            <Button
              onClick={() => setShowChatWindow(true)}
              variant="outline"
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ouvrir Chat Window
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Liste des vendeurs de test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="w-5 h-5" />
            <span>Vendeurs de Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  const roomId = `vendor-${vendor.id}-user-demo`;
                  setTestRoomId(roomId);
                  toast.success(`Room sélectionnée: ${roomId}`);
                }}
              >
                <div className="relative">
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {vendor.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {vendor.category}
                    </Badge>
                    <span className={`text-xs ${vendor.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                      {vendor.isOnline ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      {showChatWindow && (
        <ChatWindow
          isOpen={showChatWindow}
          onClose={() => setShowChatWindow(false)}
          roomId={testRoomId}
          roomType="vendor"
          recipient={{
            id: 'vendor-1',
            name: 'Boutique Afrique Mode',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            isOnline: true
          }}
        />
      )}
    </div>
  );
};

export default ChatDemo;
