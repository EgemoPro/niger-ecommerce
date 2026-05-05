# Quick Reference - Niger E-commerce Chat System

## File Paths Summary

| Component | Path | Purpose |
|-----------|------|---------|
| Redux Slice | `/src/redux/Slices/conversationsSlice.js` | Main conversation state management |
| Chat Component | `/src/components/chat/EmbeddedChatWindow.jsx` | Main UI component |
| Socket Hook | `/src/hooks/useConversationSocket.js` | Real-time conversation management |
| Socket Manager | `/src/Socket.js` | Socket.IO singleton |
| HTTP Client | `/src/lib/axios.js` | Axios configuration with JWT injection |
| Middleware | `/src/redux/middleware/socketMiddleware.js` | Socket event → Redux bridge |
| Store Config | `/src/redux/store.js` | Redux store setup |
| Environment | `/.env` | Configuration variables |

## Key State Storage (Redux)

### conversations Slice
```
state.conversations.messages          // Current conversation messages array
state.conversations.currentConversation // Active conversation object
state.conversations.typingUsers[id]   // Users typing in conversation
state.conversations.unreadCounts[id]  // Unread message count per conversation
```

## REST API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/conversations` | List user's conversations |
| GET | `/conversations/:id` | Get single conversation |
| GET | `/conversations/:id/messages` | Fetch messages (paginated) |
| POST | `/conversations` | Create new conversation |
| POST | `/conversations/:id/messages` | Send message |
| PUT | `/conversations/:id/messages/read` | Mark messages as read |

## Socket.IO Events

### Emitted (Client → Server)
```
joinConversation(conversationId, userId)
leaveConversation(conversationId, userId)
sendMessage(text, metadata)
startTyping(conversationId)
stopTyping(conversationId)
markAsRead(messageIds)
```

### Received (Server → Client)
```
newMessage(data)                    // New message
conversationTyping(data)            // User typing
conversationTypingStopped(data)     // User stopped
messageRead(data)                   // Messages marked read
messageDelivered(data)              // Message delivered
```

## Redux Actions to Use

```javascript
// For fetching
dispatch(fetchConversations(userId))
dispatch(fetchMessages(conversationId, page, limit))
dispatch(createConversation(vendorId, userId))

// For real-time (auto-dispatched via socket)
dispatch(newMessageReceived({...message}))
dispatch(addTypingUser({conversationId, userId, userName}))
dispatch(messagesMarkedAsRead({messageIds}))

// For selectors
useSelector(s => conversationsSelectors.selectMessages(s))
useSelector(s => conversationsSelectors.selectTypingUsers(s, convId))
```

## useConversationSocket Hook

```javascript
const {
  sendMessage,
  startTyping,
  stopTyping,
  markAsRead,
  typingUsers,
  isSocketConnected
} = useConversationSocket(conversationId);

// Usage
sendMessage('Hello!');
startTyping();  // Auto-stops after 3s
markAsRead([msgId1, msgId2]);
```

## Critical Issues to Fix

1. **Duplicate Actions** - `messageReceived` vs `newMessageReceived`
2. **Dual Redux Slices** - conversations vs messages (legacy)
3. **No Token Refresh** - 401 errors just redirect to login
4. **Race Condition** - joinConversation needs retry on socket connect
5. **Message ID Inconsistency** - Mix of `_id` and `id` fields
6. **File Upload TODO** - Not implemented in MessageInput

## Debug Checklist

- [ ] Check socket connection: `socketManager.isSocketConnected()`
- [ ] Enable debug: `VITE_DEBUG_SOCKET=true` in .env
- [ ] Monitor Redux: Use Redux DevTools browser extension
- [ ] Check network: Browser DevTools Network tab
- [ ] Monitor events: Look for socket emit/receive logs in console
- [ ] Verify auth: Check JWT token in cookies/localStorage

## Configuration Variables

```
VITE_SOCKET_SERVICE_HOST = ws://localhost:6000
VITE_API_URL = http://localhost:8173
VITE_DEBUG_SOCKET = true|false
VITE_CHAT_MAX_MESSAGES_PER_ROOM = 500
VITE_CHAT_TYPING_TIMEOUT = 3000
```

## Data Flow Summary

```
User Action → MessageInput → EmbeddedChatWindow → useConversationSocket
    ↓
Two paths:
├→ Socket: socketManager.emit() → Server → Broadcast
└→ HTTP: dispatch(sendMessage()) → axios → REST API → Server

Receive:
Server Event → socketManager listener → useConversationSocket handler
    ↓
dispatch(newMessageReceived()) → Redux reducer → State update
    ↓
MessageList component re-renders → User sees message
```

