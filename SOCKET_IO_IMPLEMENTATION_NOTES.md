# 🔧 Socket.IO Real-Time Chat - Implementation Notes

**Date**: May 2026  
**Author**: OpenCode AI  
**Status**: Implementation Complete

---

## 📚 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     EmbeddedChatWindow Component                 │
│  (Displays messages, input field, typing indicators)             │
└────────────────────────────────────┬──────────────────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    v                v                v
         ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
         │  Redux Thunks    │  │ useConversation  │  │    Socket.IO     │
         │  (REST API)      │  │    Socket Hook   │  │   Real-time      │
         │                  │  │                  │  │                  │
         │ - sendMessage()  │  │ - sendMessage()  │  │ - joinConversation
         │ - fetchMessages()│  │ - startTyping()  │  │ - sendMessage
         │ - markAsRead()   │  │ - stopTyping()   │  │ - startTyping
         │                  │  │ - markAsRead()   │  │ - stopTyping
         └────────┬─────────┘  └────────┬────────┘  │ - markAsRead()
                  │                     │          │
                  └──────────┬──────────┴──────────┘
                             │
                 ┌───────────┴──────────┐
                 │                      │
                 v                      v
         ┌───────────────────┐  ┌──────────────────┐
         │  conversationsSlice│  │  Socket Manager  │
         │  (Redux State)     │  │  (Singleton)     │
         │                   │  │                  │
         │ - messages[]      │  │ - socket (io)    │
         │ - typingUsers{}   │  │ - listeners Map  │
         │ - unreadCounts{}  │  │ - messageQueue[] │
         └───────────────────┘  └──────────────────┘
                 │                      │
                 └──────────┬───────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            v                               v
    ┌─────────────────┐         ┌──────────────────┐
    │  Backend API    │         │  WebSocket       │
    │  (REST)         │         │  (Socket.IO)     │
    │                 │         │                  │
    │ POST /messages  │         │ newMessage       │
    │ GET /messages   │         │ conversationTyping
    │ PUT /read       │         │ messageRead      │
    └─────────────────┘         └──────────────────┘
```

---

## 🔄 Message Flow - Sending a Message

```
User Types Message
       ↓
[Enter key pressed]
       ↓
handleSendMessage() in EmbeddedChatWindow
       ↓
sendMessage() from useConversationSocket
       ↓
├─→ socketManager.sendConversationMessage() [Real-time]
│        ↓
│   Socket.emit('sendMessage', payload)
│        ↓
│   Backend receives → broadcasts to other users
│        ↓
│   Receiver gets 'newMessage' event
│        ↓
│   dispatch(newMessageReceived(message))
│        ↓
│   Redux state.conversations.messages.push(message)
│        ↓
│   [UI updates via Redux selector]
│
└─→ dispatch(sendMessage(conversationId, data)) [REST API fallback]
         ↓
    HTTP POST /conversations/:id/messages
         ↓
    Backend saves to database
```

---

## 🎯 Real-Time Event Listeners

### Registered in useConversationSocket Hook

```javascript
socketManager.on('newMessage', (data) => {
  // Triggered when: Another user sends a message to this conversation
  // Data: { conversationId, messageId, text, sender, senderName, timestamp }
  // Action: dispatch(newMessageReceived(message))
});

socketManager.on('conversationTyping', (data) => {
  // Triggered when: Another user starts typing in this conversation
  // Data: { conversationId, userId, userName }
  // Action: dispatch(addTypingUser(...))
});

socketManager.on('conversationTypingStopped', (data) => {
  // Triggered when: Another user stops typing in this conversation
  // Data: { conversationId, userId }
  // Action: dispatch(removeTypingUser(...))
});

socketManager.on('messageRead', (data) => {
  // Triggered when: Another user reads messages in this conversation
  // Data: { conversationId, messageIds, readBy, readAt }
  // Action: dispatch(messagesMarkedAsRead(...))
});

socketManager.on('messageDelivered', (data) => {
  // Triggered when: Backend confirms message delivery
  // Data: { conversationId, messageId }
  // Action: dispatch(messageDelivered(...))
});
```

### Registered in setupEventListeners() in Socket.js

```javascript
this.socket.on('newMessage', (data) => {
  // Broadcasts to components listening via socketManager.on()
  this.notifyLocal('newMessage', data);
});

// Similar for: conversationTyping, conversationTypingStopped, messageRead
```

---

## 🔌 Socket Emission Patterns

### Pattern 1: Simple Event Emit
```javascript
socketManager.emit('joinConversation', { conversationId, userId });
```

### Pattern 2: Queued if Disconnected
```javascript
// If socket not connected, stored in messageQueue
socketManager.emit('startTyping', payload);

// On reconnection:
flushMessageQueue(); // Sent in order
```

### Pattern 3: Method Wrapper (Recommended)
```javascript
// In Socket.js
joinConversation(conversationId, userId) {
  this.emit('joinConversation', { conversationId, userId });
}

// Usage
socketManager.joinConversation(conversationId, userId);
```

---

## 📦 Redux State Structure

### conversationsSlice.js State
```javascript
{
  conversations: [
    {
      _id: "conv-123",
      vendor: { _id, name, avatar },
      lastMessage: { _id, text, sender, createdAt },
      unreadCount: 5,
      type: "user" | "store" | "order"
    }
  ],
  
  currentConversation: {
    _id: "conv-123",
    vendor: { ... },
    createdAt: "2026-05-01T...",
    typingUsers: [] // Real-time
  },
  
  messages: [
    {
      _id: "msg-456",
      conversationId: "conv-123",
      text: "Hello!",
      sender: "user-789",
      senderName: "John",
      delivered: true,
      read: true,
      createdAt: "2026-05-01T..."
    }
  ],
  
  // Real-time state
  typingUsers: {
    "conv-123": [
      { userId: "user-999", userName: "Jane" }
    ]
  },
  
  unreadCounts: {
    "conv-123": 5
  }
}
```

---

## 🪝 Hook Usage Examples

### Example 1: Basic Chat Component
```jsx
import { useConversationSocket } from '@/hooks/useConversationSocket';

export function ChatComponent({ conversationId }) {
  const {
    sendMessage,
    startTyping,
    stopTyping,
    typingUsers,
    isSocketConnected
  } = useConversationSocket(conversationId);

  const handleSend = (text) => {
    sendMessage(text);
  };

  const handleInput = () => {
    startTyping();
    // Auto-stop after 3 seconds via hook
  };

  return (
    <>
      {typingUsers.length > 0 && (
        <p>{typingUsers.map(u => u.userName).join(', ')} is typing...</p>
      )}
      <MessageInput onInput={handleInput} onSend={handleSend} />
    </>
  );
}
```

### Example 2: Multi-Conversation Support
```jsx
// Each conversation gets its own hook instance
const conv1Socket = useConversationSocket('conv-1');
const conv2Socket = useConversationSocket('conv-2');

// Separate listeners, separate state, no interference
conv1Socket.sendMessage('Hello in conv 1');
conv2Socket.sendMessage('Hello in conv 2');
```

### Example 3: Typing with Debounce
```jsx
const { startTyping, stopTyping } = useConversationSocket(conversationId);

const handleChange = (text) => {
  if (text.length === 1) {
    startTyping(); // First char → start
  }
  // Auto-stops after 3 seconds of inactivity
};
```

---

## 🔐 Security Considerations

### JWT Token Management
```javascript
// Token automatically included in:
// 1. Socket.IO auth headers
// 2. Axios request headers
// 3. Stored in localStorage + cookies

const TOKEN_KEY = 'jwt';
const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);

// Interceptor adds to every request
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### WebSocket Authentication
```javascript
// Socket.IO connection with auth
this.socket = io(SOCKET_ORIGIN, {
  auth: {
    token: token || localStorage.getItem('jwt')
  },
  extraHeaders: {
    'Authorization': 'Bearer ' + token
  }
});
```

### Message Ownership Validation
```javascript
// Only show delete button for message author
{message.sender === currentUser?.id && (
  <button onClick={() => deleteMessage(message.id)}>Delete</button>
)}
```

---

## 🎨 Typing Indicator Implementation

### Backend → Frontend Flow
```
User A starts typing
    ↓
User A: socketManager.startConversationTyping(conversationId)
    ↓
Socket.emit('startTyping', { conversationId, userId, userName })
    ↓
Backend broadcasts to conversation room
    ↓
User B receives: socketManager.on('conversationTyping', data)
    ↓
dispatch(addTypingUser({ conversationId, userId, userName }))
    ↓
Redux state.typingUsers[conversationId] = [{ userId, userName }]
    ↓
UI: <TypingIndicator userName="User A" />
    ↓
    [After 3 seconds of inactivity...]
    ↓
User A: socketManager.stopConversationTyping(conversationId)
    ↓
dispatch(removeTypingUser({ conversationId, userId }))
    ↓
Indicator disappears
```

---

## 📊 Performance Optimizations

### 1. Debounced Typing Events
```javascript
// Auto-stop after 3 seconds inactivity
typingTimeoutRef.current = setTimeout(() => {
  stopTyping();
}, 3000);

// Clears and resets on each keystroke
```

### 2. Duplicate Prevention
```javascript
// In newMessageReceived reducer
if (!state.messages.find((m) => m._id === message._id)) {
  state.messages.push(message); // Only if not already exists
}
```

### 3. Conversation-Scoped Selectors
```javascript
// Only subscribe to one conversation's typing users
const typingUsers = useSelector((state) =>
  conversationsSelectors.selectTypingUsers(state, conversationId)
);
// Not all conversations' typing users
```

### 4. Message Queue for Offline
```javascript
// If socket disconnected, queue events
messageQueue.push({ event: 'sendMessage', data: payload });

// Send when reconnected
flushMessageQueue();
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Messages Appear Twice
**Cause:** HTTP and Socket.IO both adding the message
**Solution:**
```javascript
// Check for duplicate by ID
if (!state.messages.find((m) => m._id === message._id)) {
  state.messages.push(message);
}
```

### Issue 2: Typing Indicator Never Stops
**Cause:** stopTyping() not called
**Solution:**
- Ensure `useEffect` cleanup returns `leaveConversation()`
- Auto-timeout after 3 seconds handles this
- Can manually call `stopTyping()` in onBlur

### Issue 3: Socket Events Not Triggering Redux
**Cause:** Listeners not setup in setupSocketListeners()
**Solution:**
```javascript
useEffect(() => {
  const cleanup = setupSocketListeners(); // Must call
  return cleanup; // Must cleanup
}, [conversationId, setupSocketListeners]);
```

### Issue 4: Real-Time Messages in Wrong Conversation
**Cause:** Not filtering by `conversationId`
**Solution:**
```javascript
const handleNewMessage = (data) => {
  // ✅ CORRECT: Check conversation ID
  if (data.conversationId === conversationId) {
    dispatch(newMessageReceived(...));
  }
};
```

---

## 📈 Monitoring & Debugging

### Redux DevTools
```javascript
// Monitor state changes
state.conversations.messages        // Messages array
state.conversations.typingUsers     // Typing indicator state
state.conversations.unreadCounts    // Unread message counts

// Watch actions:
CONVERSATIONS/newMessageReceived
CONVERSATIONS/addTypingUser
CONVERSATIONS/removeTypingUser
CONVERSATIONS/messagesMarkedAsRead
```

### Browser Console Logs
```javascript
// Look for:
✅ "📌 Joined conversation: conv-123"
✅ "📩 New message received: {..."
✅ "✏️ User typing in conversation: {..."
❌ "Cannot join conversation: missing conversationId"
```

### Network Tab - WebSocket
```
Filter: WS
Look for events:
- joinConversation
- sendMessage
- startTyping
- stopTyping
- markAsRead
- newMessage (incoming)
- conversationTyping (incoming)
- messageRead (incoming)
```

---

## 🚀 Deployment Considerations

### Environment Variables
```bash
# .env.production
VITE_API_URL=https://api.domain.com
VITE_SOCKET_SERVICE_HOST=wss://socket.domain.com
VITE_DEBUG_SOCKET=false
```

### CORS & WebSocket Headers
```javascript
// Backend should allow:
// 1. CORS for REST API calls
// 2. WebSocket connections
// 3. Authorization headers in both
```

### Monitoring
```javascript
// Track these metrics:
// - Socket connection success rate
// - Message delivery latency
// - Real-time vs fallback ratio
// - Typing indicator accuracy
// - Error rates
```

---

## 📚 Related Documentation

- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Hooks Docs](https://react.dev/reference/react)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

## ✅ Checklist for Developers

### Before Using This Implementation
- [ ] Backend Socket.IO server implemented with events
- [ ] REST API endpoints working for messages
- [ ] JWT auth configured on backend
- [ ] CORS policy allows WebSocket
- [ ] Database schema supports conversations & messages

### Integration Steps
- [ ] Copy `useConversationSocket.js` to `src/hooks/`
- [ ] Update `conversationsSlice.js` with new actions
- [ ] Update `Socket.js` with new methods
- [ ] Update `EmbeddedChatWindow.jsx` to use hook
- [ ] Test all 7 scenarios from SOCKET_IO_TESTING_GUIDE.md

### Customization Points
- [ ] Modify `typingTimeoutRef` (currently 3000ms)
- [ ] Adjust `messagesPerPage` (currently 50)
- [ ] Customize message format in Socket events
- [ ] Add your own event listeners in hook
- [ ] Extend typing indicator UI

---

**Implementation Complete! Ready for testing and customization.** 🎉
