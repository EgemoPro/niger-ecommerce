# 🧪 TEST & DEBUG - Sockets & Conversations

**Document de test complet**  
**Date**: May 05 2026  
**Phase**: PHASE 5 - Chat REST API & Socket.IO  

---

## 📋 INDEX

1. [Diagnostic Initial](#diagnostic-initial)
2. [Corrections Appliquées](#corrections-appliquées)
3. [Plan de Tests](#plan-de-tests)
4. [Cas de Test Détaillés](#cas-de-test-détaillés)
5. [Checklist de Validation](#checklist-de-validation)

---

## 🔍 Diagnostic Initial

### Problèmes Identifiés (Priorité)

| # | Problème | Sévérité | Statut | Solution |
|---|----------|----------|--------|----------|
| 1 | Actions Redux dupliquées | HIGH | ✅ FIXED | Merge `messageAdded` / `newMessageReceived` |
| 2 | Pas de refresh JWT | HIGH | ✅ FIXED | Queue + Retry logic dans axios |
| 3 | Race condition joinConversation | HIGH | ✅ FIXED | Retry avec backoff dans Socket.js |
| 4 | Inconsistance IDs messages (_id vs id) | MEDIUM | ✅ FIXED | Normalisation dans Redux |
| 5 | Pas d'Error Boundary chat | LOW | ⏳ TODO | Ajouter wrapper ErrorBoundary |

---

## ✅ Corrections Appliquées

### Correction #1: Redux Actions Consolidation
**Fichier**: `src/redux/Slices/conversationsSlice.js`

```javascript
// AVANT: Actions dupliquées (messageAdded + newMessageReceived)
// APRÈS: newMessageReceived comme source unique
// messageAdded maintenu pour rétrocompatibilité

✅ Lignes 82-96: messageAdded/messageUpdated dépréciées
✅ Lignes 129-136: messageReceived normalisé
✅ Lignes 157-170: newMessageReceived centralise la logique
```

**Bénéfice**: 
- Évite les doublons de messages
- Réduit la confusion entre deux chemins d'ajout
- Plus facile à maintenir

---

### Correction #2: JWT Token Refresh Mechanism
**Fichier**: `src/lib/axios.js`

```javascript
✅ Queue de requêtes échouées (failedQueue)
✅ Drapeau isRefreshing pour éviter les appels multiples
✅ Intercepteur 401 avec retry automatique
✅ Retry de requête originale avec nouveau token
```

**Mécanisme**:
1. Requête échoue avec 401
2. Si déjà en refresh → queue la requête
3. Sinon → appel `/auth/refresh` avec refreshToken
4. Stocke nouveau token
5. Retry toutes les requêtes en queue
6. Si refresh échoue → redirect login

**Bénéfice**:
- Sessions prolongées sans rechargement page
- Gestion propre des tokens expirés
- Pas de perte de requête en vol

---

### Correction #3: Race Condition - JoinConversation Retry
**Fichier**: `src/Socket.js`

```javascript
✅ Fonction joinConversation(conversationId, userId, retries=3)
✅ Détecte si socket pas encore connecté
✅ Retry avec backoff 500ms (max 3 fois)
✅ Logging détaillé de chaque tentative
```

**Avant**:
```
1. chat-page.jsx demande joinConversation
2. Socket peut ne pas être connecté
3. Emit échoue silencieusement
4. Utilisateur reçoit les messages trop tard
```

**Après**:
```
1. chat-page.jsx demande joinConversation
2. Socket pas connecté? Retry dans 500ms
3. 3 tentatives max avec backoff
4. Log clair de l'état
5. Utilisateur reçoit messages en temps réel
```

**Bénéfice**:
- Messages temps réel fiables
- Pas de perte silencieuse de join
- Meilleur debugging

---

### Correction #4: Message ID Normalization
**Fichier**: `src/redux/Slices/conversationsSlice.js`

```javascript
// AVANT: Mélange _id (MongoDB) et id (GraphQL)
// APRÈS: Stocke les deux pour compatibilité

newMessageReceived: (state, action) => {
  const messageId = message._id || message.id;
  state.messages.push({
    ...message,
    _id: messageId,      // Compatibilité MongoDB
    id: messageId,       // Compatibilité GraphQL
    // ... autres champs
  });
}
```

**Bénéfice**:
- Pas de messages dupliqués
- Fonctionne avec les deux formats
- Plus facile de fusionner avec d'autres services

---

## 🧪 Plan de Tests

### Série 1: Connection Lifecycle (Socket)

```bash
TEST 1.1: Socket Connect
├─ ✓ Token valide → connexion établie
├─ ✓ Pas de token → pas de connexion
└─ ✓ Token expiré → reconnexion après refresh

TEST 1.2: Socket Disconnect
├─ ✓ Utilisateur logout → socket fermé
├─ ✓ Utilisateur change tab → pas de déconnexion
└─ ✓ Perte réseau → reconnexion automatique

TEST 1.3: Socket Reconnect
├─ ✓ Max 5 tentatives
├─ ✓ Exponential backoff
└─ ✓ Queue des messages pendant reconnexion
```

### Série 2: Message Flow (REST + Socket)

```bash
TEST 2.1: Send Message
├─ ✓ REST: POST /conversations/:id/messages
├─ ✓ Socket: emit 'sendMessage'
├─ ✓ Redux: newMessageReceived
└─ ✓ UI: Message affiché immédiatement (optimistic)

TEST 2.2: Receive Message
├─ ✓ Socket: 'newMessage' event
├─ ✓ Redux: newMessageReceived
├─ ✓ Avoid duplicates (_id check)
└─ ✓ UI: Message affiché pour destinataire

TEST 2.3: Message Delivery & Read
├─ ✓ messageDelivered event
├─ ✓ messagesMarkedAsRead event
├─ ✓ Read receipts affichés
└─ ✓ Statut: sent → delivered → read
```

### Série 3: Real-time Features

```bash
TEST 3.1: Typing Indicators
├─ ✓ startTyping → emit
├─ ✓ Redux: addTypingUser
├─ ✓ UI: "John is typing..."
├─ ✓ stopTyping après 3s d'inactivité
├─ ✓ Timeout edge case (pas de double-stop)
└─ ✓ Typing stopped → removeTypingUser

TEST 3.2: Online Status
├─ ✓ userOnline event
├─ ✓ userOffline event
├─ ✓ Avatar: green dot si online
└─ ✓ Statut: "En ligne" / "Hors ligne"

TEST 3.3: Unread Counts
├─ ✓ unreadCount: { conversationId: N }
├─ ✓ Badge: nombre de messages non lus
├─ ✓ markMessagesAsRead → count = 0
└─ ✓ Nouveau message → count++
```

### Série 4: Conversation Management

```bash
TEST 4.1: List Conversations
├─ ✓ GET /conversations (pagination)
├─ ✓ Redux: conversationsSuccess
├─ ✓ UI: Affiche liste chats
└─ ✓ Filtrage par nom vendeur

TEST 4.2: Create Conversation
├─ ✓ POST /conversations { storeId }
├─ ✓ Conversation crée avec dernier message
├─ ✓ Socket: joinConversation automatique
└─ ✓ Historique chargé via fetchMessages

TEST 4.3: Get Conversation Detail
├─ ✓ GET /conversations/:id
├─ ✓ Charge métadonnées (participants, etc)
├─ ✓ Socket: rejoindre room
└─ ✓ Notifications de read receipt
```

### Série 5: Error Handling

```bash
TEST 5.1: API Errors
├─ ✓ 400: Affiche détail du champ
├─ ✓ 401: Refresh JWT ou redirect login
├─ ✓ 404: "Conversation non trouvée"
├─ ✓ 409: "Conversation déjà existante"
├─ ✓ 429: Rate limit message
├─ ✓ 502: Service unavailable
└─ ✓ 500: Generic error message

TEST 5.2: Socket Errors
├─ ✓ connect_error: Retry + log
├─ ✓ unauthorized: Redirect login
├─ ✓ maxReconnectAttemptsReached: Toast alert
└─ ✓ Network error: Graceful degradation

TEST 5.3: Offline Queue
├─ ✓ Message queued quand offline
├─ ✓ Envoi auto quand reconnecté
├─ ✓ Pas de doublon après reconnexion
└─ ✓ User feedback: "Envoi en attente..."
```

---

## 🧬 Cas de Test Détaillés

### SCENARIO 1: User Logs In → Opens Chat

```
1. User logs in
   ✓ Token stocké dans JWT cookie + localStorage
   ✓ useSocket hook détecte auth change
   ✓ socketManager.connect(token)

2. Socket connect event
   ✓ console.log: "✅ Socket connecté"
   ✓ isConnected = true
   ✓ Flush messageQueue (messages en attente)
   ✓ joinUserRooms() (user:${userId})

3. Chat page opens
   ✓ fetchConversations() appelé
   ✓ Redux: conversationsSuccess
   ✓ Liste des chats affichée

4. User clicks conversation
   ✓ fetchMessages(conversationId)
   ✓ joinConversation(conversationId, userId)
   ✓ Messages affichés
   ✓ Socket listener: 'newMessage'
   ✓ Ready pour messages temps réel

EXPECTED RESULT ✅: 
- Conversations listées
- Messages historiques affichés
- Socket connecté et prêt pour temps réel
```

---

### SCENARIO 2: User Types Message

```
1. User types in message input
   ✓ startTyping() appelé (debounced)
   ✓ Socket emit: 'startTyping' 
   ✓ Redux: addTypingUser(conversationId, userId)

2. Other user sees typing indicator
   ✓ Socket receive: 'conversationTyping'
   ✓ Redux: addTypingUser
   ✓ UI: "John is typing..."

3. User stops typing (3s timeout)
   ✓ setTimeout(stopTyping, 3000)
   ✓ Socket emit: 'stopTyping'
   ✓ Redux: removeTypingUser
   ✓ UI: Typing indicator disparaît

EXPECTED RESULT ✅:
- Typing visible en temps réel
- Disparaît automatiquement après 3s
- Pas de double-stop (edge case handled)
```

---

### SCENARIO 3: User Sends Message

```
1. User types + clicks Send
   ✓ Redux: sendMessageRequest()
   ✓ API: POST /conversations/:id/messages
   ✓ Optimistic update: Message added localement

2. Server responses
   ✓ Redux: sendMessageSuccess(message)
   ✓ Message avec _id (DB), id (normalized)
   ✓ Timestamp synchronisé

3. Other users receive via Socket
   ✓ Server broadcasts: 'newMessage'
   ✓ Socket listener: on('newMessage')
   ✓ Redux: newMessageReceived
   ✓ Check _id pour éviter doublon
   ✓ Message affiché pour tous

4. Delivery & Read receipts
   ✓ messageDelivered event
   ✓ Redux: messageDelivered
   ✓ markMessagesAsRead: PUT endpoint
   ✓ messagesMarkedAsRead event
   ✓ UI: Statut sent → delivered → read

EXPECTED RESULT ✅:
- Message envoyé rapidement (optimistic)
- Tous les utilisateurs le voient
- Pas de doublon
- Statut delivery/read mis à jour
```

---

### SCENARIO 4: Network Disconnect

```
1. Network loss detected
   ✓ Socket: 'disconnect' event
   ✓ Redux: connectionStatus = 'disconnected'
   ✓ UI: Badge "Reconnexion..."

2. User types/sends message
   ✓ Socket check: isConnected = false
   ✓ Message queued: messageQueue.push()
   ✓ UI: "Envoi en attente"

3. Network restored
   ✓ Socket: 'reconnect' event
   ✓ flushMessageQueue()
   ✓ Tous les messages queued envoyés
   ✓ Redux: connectionStatus = 'connected'
   ✓ UI: Badge "En ligne"

4. Message received
   ✓ No duplicate (même _id check)
   ✓ Affichage normal

EXPECTED RESULT ✅:
- Messages pas perdus
- Queue vidée à la reconnexion
- Pas de doublon
- User feedback clair
```

---

### SCENARIO 5: Token Expiration

```
1. User fait une requête après expiration
   ✓ API: 401 Unauthorized
   ✓ axios interceptor: 401 detected

2. Token refresh
   ✓ Fetch refreshToken depuis cookie
   ✓ POST /auth/refresh avec refreshToken
   ✓ Reçoit nouveau token + nouveau refreshToken

3. Nouvelle tentative
   ✓ Stocke nouveau token
   ✓ Retry requête originale
   ✓ Ajoute token dans header

4. Requête complète
   ✓ Succès avec nouveau token
   ✓ User ne voit rien (transparent)

EDGE CASES:
- Si refreshToken expiré aussi → redirect login
- Si 401 sur /auth/refresh → logout
- Queue: Autres requêtes en attente sont retryées

EXPECTED RESULT ✅:
- Session prolongée sans rechargement
- Requête complète sans erreur utilisateur
- Très transparent
```

---

## ✔️ Checklist de Validation

### Phase 1: Redux & State Management
```
[ ] ✅ Actions Redux normalisées (pas de duplication)
[ ] ✅ IDs messages normalisés (_id + id)
[ ] ✅ Sélecteurs Redux accessibles
[ ] ✅ Avoid duplicates avec _id check
[ ] ✅ Pagination Redux fonctionnelle
```

### Phase 2: Socket.IO Connection
```
[ ] Socket connect avec token JWT
[ ] Socket disconnect au logout
[ ] Reconnect avec exponential backoff
[ ] Max 5 reconnection attempts
[ ] messageQueue flushed après reconnect
[ ] joinUserRooms() appelé post-connect
```

### Phase 3: REST API Endpoints
```
[ ] GET /conversations → liste
[ ] GET /conversations/:id → détail
[ ] GET /conversations/:id/messages → historique
[ ] POST /conversations → créer
[ ] POST /conversations/:id/messages → envoyer
[ ] PUT /conversations/:id/messages/read → marquer lu
```

### Phase 4: Real-time Events (Socket)
```
[ ] joinConversation avec retry logic
[ ] leaveConversation proper cleanup
[ ] sendMessage via Socket + REST
[ ] receiveMessage + Redux update
[ ] newMessage + deduplication
[ ] conversationTyping + UI indicator
[ ] conversationTypingStopped timeout
[ ] messageDelivered status update
[ ] messageRead status update
[ ] messagesMarkedAsRead batch
```

### Phase 5: Error Handling
```
[ ] 401 Token refresh + retry
[ ] 401 refresh fail → logout
[ ] 423 Account locked message
[ ] 429 Rate limit message
[ ] 502 Service unavailable message
[ ] connect_error proper logging
[ ] unauthorized → redirect
[ ] Network error → offline queue
```

### Phase 6: UI Components
```
[ ] chat-page.jsx loads correctly
[ ] EmbeddedChatWindow renders
[ ] MessageList shows messages
[ ] MessageInput sends correctly
[ ] Typing indicator appears/disappears
[ ] Online status badge visible
[ ] Unread count badge correct
[ ] Error messages displayed
[ ] Loading states shown
[ ] Mobile responsive layout
```

### Phase 7: Performance & Edge Cases
```
[ ] No message duplicates (millions of requests)
[ ] Typing timeout no double-stop
[ ] Offline queue cleared on reconnect
[ ] Multiple conversations don't interfere
[ ] Large message history paginated
[ ] Socket events aren't lost
[ ] Redux state doesn't bloat
[ ] Memory leaks cleaned up
```

---

## 📊 Test Execution Template

### Test Case #X: [Test Name]

**Precondition**:
- [ ] User logged in with valid token
- [ ] Socket connected and ready
- [ ] [Other setup...]

**Steps**:
1. [ ] Step 1 description
2. [ ] Step 2 description
3. [ ] Step 3 description

**Expected Result**:
- [ ] Outcome 1
- [ ] Outcome 2
- [ ] Outcome 3

**Actual Result**:
- [Tester fills this]

**Status**: 🔴 FAILED / 🟡 IN PROGRESS / 🟢 PASSED

**Notes**:
```
[Tester fills this]
```

---

## 📝 Exécution Rapide

### 1️⃣ Lancer le projet
```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

### 2️⃣ Open DevTools Console
```
F12 ou Cmd+Opt+I
Chercher les logs: 🔌, 💬, ✅, ❌
```

### 3️⃣ Test basic flow
```
1. Go to /auth/login
2. Login avec credentials
3. Go to /chat
4. Ouvrir une conversation
5. Envoyer un message
6. Vérifier console pour les logs Socket
7. Deconnecter réseau dans DevTools
8. Envoyer un message (queue)
9. Reconnecter réseau
10. Vérifier que message a été envoyé
```

### 4️⃣ Vérifier Redux State
```javascript
// Dans DevTools console
store.getState().conversations
// Vérifier:
// - conversations array
// - messages array
// - typingUsers
// - unreadCounts
```

### 5️⃣ Vérifier Socket Events
```javascript
// Dans DevTools console
// Socket.js ajoute tous les logs:
// 🔌 Connection events
// 💬 Message events
// ✅ Success events
// ❌ Error events
```

---

## 🎯 Success Criteria

Tous les tests PASSENT ✅ quand:

1. ✅ Messages envoyés et reçus sans doublon
2. ✅ Typing indicators s'affichent/disparaissent
3. ✅ Offline queue vidée à la reconnexion
4. ✅ Token refresh transparent
5. ✅ UI responsive et sans lag
6. ✅ Pas d'erreur dans console
7. ✅ Redux state cohérent
8. ✅ Socket connected badge correct
9. ✅ All error cases handled
10. ✅ Mobile view works correctly

---

**Document finalisé ✅**  
**Ready pour exécution! 🚀**
