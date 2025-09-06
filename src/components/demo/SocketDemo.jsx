import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Bell, 
  Wifi, 
  WifiOff, 
  Send, 
  TestTube,
  Play,
  Square,
  Users,
  Package,
  ShoppingCart
} from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { addNotification } from '../../redux/Slices/notificationSlice';
import { toast } from 'sonner';

const SocketDemo = ({ className = "" }) => {
  const dispatch = useDispatch();
  const {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    messages,
    notifications,
    markNotificationAsRead,
    getUnreadMessagesCount
  } = useSocket();

  const auth = useSelector(state => state.auth);
  const [testRoomId, setTestRoomId] = useState('demo-room-123');
  const [testMessage, setTestMessage] = useState('Bonjour, c\'est un message de test !');
  const [isDemo, setIsDemo] = useState(false);

  // État de la démo
  const [demoStep, setDemoStep] = useState(0);
  const demoSteps = [
    'Connexion Socket',
    'Rejoindre une room',
    'Envoyer un message',
    'Simuler une notification',
    'Test des indicateurs',
    'Déconnexion'
  ];

  // Simuler une session d'authentification pour le test
  useEffect(() => {
    if (!auth.token && typeof window !== 'undefined') {
      // Simuler un token pour les tests
      const fakeToken = 'fake-jwt-token-for-testing';
      const fakeUser = {
        id: 'test-user-123',
        username: 'TestUser',
        email: 'test@example.com'
      };
      
      // Stocker temporairement pour les tests
      localStorage.setItem('jwt', fakeToken);
      localStorage.setItem('user', JSON.stringify(fakeUser));
    }
  }, [auth.token]);

  // Fonctions de test
  const testConnection = async () => {
    console.log('🧪 Test de connexion Socket...');
    if (isConnected) {
      disconnect();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    connect();
    toast.success('Test de connexion lancé !');
  };

  const testJoinRoom = () => {
    console.log(`🏠 Test rejoindre room: ${testRoomId}`);
    joinRoom(testRoomId, 'demo');
    toast.success(`Rejoint la room: ${testRoomId}`);
  };

  const testSendMessage = () => {
    if (!isConnected) {
      toast.error('Socket non connecté !');
      return;
    }
    
    console.log(`💬 Test envoi message: ${testMessage}`);
    sendMessage(testRoomId, testMessage);
    toast.success('Message de test envoyé !');
  };

  const testNotification = () => {
    const notifications = [
      {
        type: 'order_confirmed',
        title: '🛍️ Commande confirmée',
        message: 'Votre commande de test a été confirmée !',
        priority: 'high'
      },
      {
        type: 'price_drop',
        title: '💰 Baisse de prix',
        message: 'Le produit de test a baissé de 25% !',
        priority: 'medium'
      },
      {
        type: 'message',
        title: '💬 Nouveau message',
        message: 'Vous avez reçu un message de test',
        priority: 'low'
      }
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    
    dispatch(addNotification({
      ...randomNotification,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: '/test'
    }));
    
    console.log('🔔 Notification de test ajoutée:', randomNotification.title);
    toast.success(`Notification de test: ${randomNotification.title}`);
  };

  const simulateBackendEvents = () => {
    console.log('🎭 Simulation d\'événements backend...');
    
    // Simuler réception d'un message après 2 secondes
    setTimeout(() => {
      const fakeMessage = {
        id: `fake-msg-${Date.now()}`,
        roomId: testRoomId,
        message: 'Ceci est un message simulé du backend !',
        sender: 'backend-bot',
        senderName: 'Bot de Test',
        timestamp: new Date().toISOString(),
        type: 'text',
        read: false
      };
      
      // Dispatch directement pour simuler la réception
      dispatch({ type: 'messages/addMessage', payload: fakeMessage });
      toast.info('Message simulé reçu !');
    }, 2000);

    // Simuler une notification après 4 secondes
    setTimeout(() => {
      testNotification();
    }, 4000);
  };

  const runFullDemo = async () => {
    setIsDemo(true);
    setDemoStep(0);
    
    for (let step = 0; step < demoSteps.length; step++) {
      setDemoStep(step);
      console.log(`📋 Étape ${step + 1}: ${demoSteps[step]}`);
      
      switch (step) {
        case 0: // Connexion
          if (!isConnected) await testConnection();
          await new Promise(resolve => setTimeout(resolve, 2000));
          break;
          
        case 1: // Rejoindre room
          testJoinRoom();
          await new Promise(resolve => setTimeout(resolve, 1500));
          break;
          
        case 2: // Envoyer message
          testSendMessage();
          await new Promise(resolve => setTimeout(resolve, 1500));
          break;
          
        case 3: // Notification
          testNotification();
          await new Promise(resolve => setTimeout(resolve, 2000));
          break;
          
        case 4: // Indicateurs
          simulateBackendEvents();
          await new Promise(resolve => setTimeout(resolve, 5000));
          break;
          
        case 5: // Déconnexion (optionnel)
          // disconnect();
          break;
      }
    }
    
    setIsDemo(false);
    toast.success('🎉 Démo terminée avec succès !');
  };

  const stopDemo = () => {
    setIsDemo(false);
    setDemoStep(0);
    toast.info('Démo arrêtée');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TestTube className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Test Socket & Notifications</h2>
        </div>
        
        {/* Indicateur de connexion */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="text-sm font-medium">{connectionStatus}</span>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room ID de test
          </label>
          <input
            type="text"
            value={testRoomId}
            onChange={(e) => setTestRoomId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="demo-room-123"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message de test
          </label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Message de test..."
          />
        </div>
      </div>

      {/* État actuel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <MessageCircle className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-blue-900">Messages</div>
          <div className="text-lg font-bold text-blue-600">
            {getUnreadMessagesCount() || 0}
          </div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <Bell className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-purple-900">Notifications</div>
          <div className="text-lg font-bold text-purple-600">
            {notifications.totalUnread || 0}
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-green-900">Rooms</div>
          <div className="text-lg font-bold text-green-600">
            {messages.activeRooms.length}
          </div>
        </div>
        
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <Package className="w-6 h-6 text-orange-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-orange-900">Status</div>
          <div className="text-xs font-bold text-orange-600">
            {connectionStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Tests individuels */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Tests individuels</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={testConnection}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Wifi className="w-4 h-4" />
            <span>Test Connexion</span>
          </button>
          
          <button
            onClick={testJoinRoom}
            disabled={!isConnected}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Users className="w-4 h-4" />
            <span>Rejoindre Room</span>
          </button>
          
          <button
            onClick={testSendMessage}
            disabled={!isConnected}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer Message</span>
          </button>
          
          <button
            onClick={testNotification}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>Test Notification</span>
          </button>
        </div>
      </div>

      {/* Démo complète */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Démo complète</h3>
        
        {isDemo && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Étape {demoStep + 1}: {demoSteps[demoStep]}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(((demoStep + 1) / demoSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={isDemo ? stopDemo : runFullDemo}
            className={`flex items-center justify-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
              isDemo 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {isDemo ? (
              <>
                <Square className="w-4 h-4" />
                <span>Arrêter la démo</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Lancer la démo complète</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages récents (pour debug) */}
      {messages.messagesByRoom[testRoomId]?.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Messages récents</h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {messages.messagesByRoom[testRoomId].slice(-3).map((message) => (
              <div key={message.id} className="text-sm bg-gray-50 p-2 rounded">
                <span className="font-medium text-blue-600">{message.senderName}: </span>
                <span className="text-gray-800">{message.message}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SocketDemo;
