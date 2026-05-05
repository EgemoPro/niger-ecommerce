# 🧪 PLAN DE DÉBOGAGE & TEST - PHASE 5 (Chat Socket.IO)

**Date** : 5 Mai 2026  
**Statut** : ✅ Implémentation complétée, passage au DEBUG/TEST

---

## 📊 STATE DES LIEUX

### ✅ Ce qui est FAIT
- [x] Socket.js complété avec 6 méthodes conversation
- [x] Redux conversationsSlice avec 11 actions
- [x] Hook useConversationSocket créé (346 lignes)
- [x] EmbeddedChatWindow.jsx refactorisé
- [x] Documentation complète (4 fichiers)

### ❓ À VÉRIFIER (Debug)
- [ ] Axios interceptors (PHASE 1) → erreurs 401, 423, 429, 502
- [ ] conversationService.js existe-il?
- [ ] Les endpoints REST du backend répondent-ils?
- [ ] Socket.IO se connecte-t-il correctement?
- [ ] Redux state se met à jour en temps réel?

### 🎯 À TESTER (Validation)
- [ ] Messages apparaissent en temps réel
- [ ] Typing indicators fonctionnent
- [ ] Read receipts s'enregistrent
- [ ] Connection recovery fonctionne
- [ ] Pas de cross-talk entre conversations

---

## 🔍 PHASE DEBUG 1 : ENVIRONNEMENT (30 min)

### Étape 1.1 : Vérifier Configuration Vite
```bash
# Vérifier le proxy existe
cat vite.config.js | grep -A 5 "proxy:"
```

**✅ Devrait avoir** :
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

### Étape 1.2 : Vérifier les Variables d'Environnement
```bash
# Vérifier .env ou .env.local
cat .env.local 2>/dev/null || cat .env 2>/dev/null || echo "❌ Aucun .env trouvé"
```

**✅ Devrait avoir** :
```
VITE_API_URL=http://localhost:8000
VITE_SOCKET_SERVICE_HOST=http://localhost:8000
```

### Étape 1.3 : Vérifier les Services
```bash
# Rechercher conversationService.js
find . -name "*conversationService*" -o -name "*conversation-service*"
```

**✅ Devrait EXISTER** : `src/services/conversationService.js`

### Étape 1.4 : Vérifier Axios Interceptors
```bash
# Grep dans axios.js pour voir les interceptors
grep -n "interceptors.response" src/lib/axios.js
```

**✅ Devrait avoir** : Intercept 401, 423, 429, 502

---

## 🔌 PHASE DEBUG 2 : SOCKET.IO (30 min)

### Étape 2.1 : Vérifier Socket.js Complétude
```bash
# Vérifier que les méthodes existent
grep -n "joinConversation\|sendConversationMessage\|startConversationTyping" src/Socket.js
```

**✅ Devrait avoir ces 6 méthodes** :
- joinConversation(conversationId)
- leaveConversation(conversationId)
- sendConversationMessage(conversationId, content)
- startConversationTyping(conversationId)
- stopConversationTyping(conversationId)
- markConversationMessagesAsRead(conversationId)

### Étape 2.2 : Vérifier Event Listeners
```bash
# Vérifier que les listeners Socket.IO existent
grep -n "socket.on(" src/Socket.js | grep -i "conversation\|message\|typing"
```

**✅ Devrait avoir** :
- newMessage
- conversationTyping
- conversationTypingStopped
- messageRead
- conversationUpdated

### Étape 2.3 : Vérifier useConversationSocket Hook
```bash
# Vérifier le hook existe
ls -la src/hooks/useConversationSocket.js
wc -l src/hooks/useConversationSocket.js
```

**✅ Devrait** :
- Exister et avoir ~346 lignes
- Avoir useEffect pour subscribe/unsubscribe
- Avoir typing debounce (3 secondes)
- Dispatcher actions Redux

---

## 📡 PHASE DEBUG 3 : REDUX (30 min)

### Étape 3.1 : Vérifier conversationsSlice Actions
```bash
# Vérifier les 11 actions Redux
grep -n "export const\|\.addCase" src/redux/Slices/conversationsSlice.js | head -20
```

**✅ Devrait avoir** :
- newMessageReceived
- addTypingUser
- removeTypingUser
- messagesMarkedAsRead
- messageDelivered
- conversationTypingUpdate
- conversationTypingStopped
- (+ autres)

### Étape 3.2 : Vérifier Redux Selectors
```bash
# Vérifier les selectors
grep -n "selectTypingUsers\|selectUnreadCount" src/redux/Slices/conversationsSlice.js
```

**✅ Devrait avoir** : 6+ selectors pour typing, read, unread, etc.

### Étape 3.3 : Vérifier Redux Middleware
```bash
# Vérifier Redux DevTools compatible
grep -n "redux-devtools\|composeWithDevTools" src/redux/store.js
```

**✅ Devrait avoir** : Integration Redux DevTools

---

## 🏃 PHASE TEST 1 : QUICK START (5 min)

### Test 1.1 : Démarrer le serveur
```bash
npm run dev
# ✅ Devrait démarrer sur http://localhost:5173
```

### Test 1.2 : Ouvrir dans 2 navigateurs
```
Tab 1: http://localhost:5173/chat (User A)
Tab 2: http://localhost:5173/chat (User B)
```

### Test 1.3 : Envoyer un message
```
Tab 1: Écrire "Hello from Tab 1" → Envoyer
✅ Attendre: Message apparaît INSTANTANÉMENT dans Tab 2
```

### Test 1.4 : Vérifier Console
```
Tab 1 & 2: F12 → Console
✅ Pas d'erreurs rouges
✅ Logs: "Socket connected", "Message received", etc.
```

### Test 1.5 : Vérifier Redux DevTools
```
F12 → Redux DevTools (si extension installée)
✅ Actions: CONVERSATIONS/newMessageReceived
✅ State: messages array se met à jour
```

---

## 🎯 PHASE TEST 2 : TESTS MANUELS (45 min)

### TEST 2.1 : Messages en temps réel
**Préparation**
- 2 onglets ouverts, utilisateurs différents
- Ouvrir même conversation dans les 2

**Étapes**
1. Tab 1 : Écrire "Test Message"
2. Tab 2 : Observer le message apparaître < 100ms
3. Répéter 5 fois
4. Vérifier qu'aucun message ne manque

**✅ PASS**: Messages synchronisés sans délai perceptible

---

### TEST 2.2 : Typing Indicator
**Étapes**
1. Tab 1 : Commencer à taper (ne pas envoyer)
2. Tab 2 : Vérifier "User A est en train de taper..." apparaît
3. Tab 1 : Arrêter de taper
4. Tab 2 : Vérifier indicateur disparaît après 3s max

**✅ PASS**: Typing indicator fonctionne, auto-stop après 3s

---

### TEST 2.3 : Read Receipts
**Étapes**
1. Tab 1 : Envoyer "Message to read"
2. Tab 2 : Cliquer sur le message (ouvrir conversation si nécessaire)
3. Tab 1 : Vérifier "✓✓" (lu) sur le message

**✅ PASS**: Read receipt se met à jour en temps réel

---

### TEST 2.4 : Connection Recovery
**Étapes**
1. Tab 1 : Ouvrir chat, envoyer message
2. Tab 1 : F12 → Network → Throttling → Offline
3. Tab 1 : Essayer envoyer message (devrait queuer)
4. Tab 1 : Throttling → Offline OFF
5. Tab 1 : Vérifier message envoyé après reconnection

**✅ PASS**: Message queué et envoyé après reconnexion

---

### TEST 2.5 : Multi-Conversation Isolation
**Étapes**
1. Tab 1 : Ouvrir Conversation A
2. Tab 2 : Ouvrir Conversation B
3. Tab 1 : Envoyer message dans A
4. Tab 2 : Vérifier que message n'apparaît PAS dans B
5. Tab 3 (ou reload) : Ouvrir Conversation A, vérifier message y est

**✅ PASS**: Messages isolés par conversation, pas de cross-talk

---

### TEST 2.6 : Initial Message Load
**Étapes**
1. Tab 1 : Ouvrir Conversation A
2. Vérifier que les 30-50 messages précédents chargent
3. Vérifier qu'il y a un bouton "Load more" ou scroll infini
4. Cliquer "Load more" → vérifier 30 anciens messages chargent

**✅ PASS**: Messages historiques chargent correctement

---

### TEST 2.7 : Message Pagination
**Étapes**
1. Conversation avec >50 messages
2. Vérifier qu'on voit les 50 derniers
3. Scroll haut ou cliquer "Load more"
4. Vérifier que les messages plus anciens chargent
5. Vérifier pas de doublons

**✅ PASS**: Pagination fonctionne, pas de doublons

---

## 🔧 PHASE DEBUG 4 : INSPECTION PROFONDE (45 min)

### Debug 4.1 : Vérifier Redux State Structure
**Dans Redux DevTools** :
1. F12 → Redux → "Slices/conversationsSlice"
2. **✅ Devrait avoir** :
```javascript
{
  conversations: {
    byId: {
      "conv-123": {
        _id: "conv-123",
        messages: [...],
        typingUsers: ["user-456"],  // 👈 Pour indicator
        unreadCount: 3,
        lastMessage: {...},
        createdAt: "...",
        participants: [...]
      }
    },
    allIds: ["conv-123"],
    isLoading: false,
    error: null
  }
}
```

### Debug 4.2 : Vérifier Socket Connection
**Dans Network Tab** :
1. F12 → Network → Filter "socket.io"
2. **✅ Devrait voir** :
   - WebSocket upgrade
   - Messages `joinConversation` event
   - Messages `sendMessage` event
   - Incoming `newMessage` event

### Debug 4.3 : Vérifier Message IDs
**Dans Console** :
```javascript
// Vérifier pas de doublons via ID
const messages = document.querySelectorAll('[data-message-id]');
const ids = Array.from(messages).map(m => m.dataset.messageId);
console.log('Unique?', ids.length === new Set(ids).size);
```

**✅ Devrait** : true (pas de doublons)

### Debug 4.4 : Performance Check
**Dans Console** :
```javascript
// Vérifier latence message
performance.mark('send-start');
// [Envoyer message]
// [Observer dans Redux]
performance.mark('send-end');
performance.measure('send-time', 'send-start', 'send-end');
console.log(performance.getEntriesByName('send-time')[0].duration);
```

**✅ Devrait** : < 100ms

---

## ❌ TROUBLESHOOTING

### Problème: "Socket not connected"
**Vérifier**:
1. Backend API tourne? `curl http://localhost:8000/health`
2. Socket.IO server disponible? `curl http://localhost:8000/socket.io/`
3. Token JWT valide? Vérifier localStorage
4. CORS configuré? Vérifier backend headers

**Fix**:
```javascript
// Dans src/Socket.js
console.log('Socket connecting with token:', token);
console.log('Socket URL:', process.env.VITE_SOCKET_SERVICE_HOST);
```

---

### Problème: "Messages not appearing in other tab"
**Vérifier**:
1. Même conversation ouverte dans les 2 tabs?
2. Redux DevTools → Action `newMessageReceived` fired?
3. Network tab → Socket event `newMessage` reçu?
4. Console → Erreurs?

**Fix**:
```javascript
// Ajouter logs dans useConversationSocket.js
socket.on('newMessage', (data) => {
  console.log('📩 New message received:', data);
  dispatch(newMessageReceived(data));
});
```

---

### Problème: "Typing indicator stays on"
**Vérifier**:
1. Timer de 3 secondes fonctionne?
2. Action `removeTypingUser` se déclenche?

**Fix**:
```javascript
// Dans useConversationSocket.js
clearTimeout(typingTimeoutRef.current);
typingTimeoutRef.current = setTimeout(() => {
  console.log('⏰ Typing timeout, stopping typing');
  socket.emit('stopTyping', { conversationId });
}, 3000);
```

---

### Problème: "Read receipts not updating"
**Vérifier**:
1. Action `markConversationMessagesAsRead` envoyée?
2. Socket event `messageRead` reçu?
3. Redux state `read: true` ajouté?

**Fix**:
```javascript
// Dans useConversationSocket.js
useEffect(() => {
  const conversation = conversations[conversationId];
  if (conversation?.messages?.length > 0) {
    console.log('📌 Marking messages as read in', conversationId);
    socket.emit('markAsRead', { conversationId });
    dispatch(markConversationMessagesAsRead({
      conversationId,
      userId: currentUserId
    }));
  }
}, [conversationId]);
```

---

## 📋 CHECKLIST FINALE

### Avant de valider PHASE 5 ✅

- [ ] Tous les fichiers existent
  - [ ] src/Socket.js ✅
  - [ ] src/hooks/useConversationSocket.js ✅
  - [ ] src/redux/Slices/conversationsSlice.js ✅
  - [ ] src/components/chat/EmbeddedChatWindow.jsx ✅
  - [ ] src/services/conversationService.js ❓

- [ ] Configuration OK
  - [ ] Vite proxy vers /api ✅
  - [ ] .env variables ❓
  - [ ] Redux store setup ❓

- [ ] Socket.IO OK
  - [ ] 6 méthodes présentes ✅
  - [ ] 5 event listeners présents ✅
  - [ ] Token JWT passé ✅

- [ ] Redux OK
  - [ ] 11+ actions présentes ✅
  - [ ] State structure correct ❓
  - [ ] Selectors accessibles ✅

- [ ] Tests Passent
  - [ ] TEST 2.1: Messages temps réel ❓
  - [ ] TEST 2.2: Typing indicator ❓
  - [ ] TEST 2.3: Read receipt ❓
  - [ ] TEST 2.4: Connection recovery ❓
  - [ ] TEST 2.5: Multi-conversation ❓
  - [ ] TEST 2.6: Initial load ❓
  - [ ] TEST 2.7: Pagination ❓

---

## 🚀 PROCHAINES ÉTAPES APRÈS VALIDATION

1. **PHASE 5.3 Complète** (Page Chat finalisée)
2. **PHASE 6** : Favoris & Following (1 jour)
3. **PHASE 7** : Tests & Polish (3 jours)

---

**Document ready for execution!** 🎯
