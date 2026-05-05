# Niger E-commerce Codebase Analysis Report

## Overview
This is a comprehensive analysis of the Niger E-commerce platform's chat/conversation system, including Redux state management, Socket.IO integration, and REST API endpoints.

---

## 1. FILE STRUCTURE & LOCATIONS

### Core Chat Files
```
/src/
├── redux/
│   ├── Slices/
│   │   ├── conversationsSlice.js       # Main Redux slice for conversations
│   │   └── messageSlice.js             # Legacy message slice (backup system)
│   ├── middleware/
│   │   └── socketMiddleware.js         # Socket.IO event middleware
│   └── store.js                        # Redux store configuration
├── hooks/
│   ├── useSocket.js                    # Legacy socket hook
│   └── useConversationSocket.js        # Modern conversation-specific hook
├── components/chat/
│   ├── EmbeddedChatWindow.jsx          # Main chat UI component
│   ├── MessageList.jsx                 # Message display component
│   ├── MessageInput.jsx                # Message input component
│   ├── TypingIndicator.jsx             # (Not shown but referenced)
│   └── ...other chat components
├── Socket.js                            # Socket.IO singleton manager
└── lib/
    └── axios.js                         # Axios HTTP client configuration
```

### Configuration Files
```
.env                                     # Environment variables
vite.config.js                          # Vite build configuration
```

---

## 2. REDUX STORE STRUCTURE

### conversations Slice (conversationsSlice.js)
**Location**: `/src/redux/Slices/conversationsSlice.js`

#### State Shape
```javascript
{
  conversations: [],           // Array of conversations
  currentConversation: null,   // Current active conversation
  messages: [],               // Messages in current conversation
  totalMessages: 0,           // Total message count
  isLoading: false,           // Loading state for conversations
  isLoadingMessages: false,   // Loading state for messages
  error: null,                // Error messages
  successMessage: null,       // Success messages
  pagination: {
    page: 1,
    limit: 50,
    total: 0
  },
  // Real-time state
  typingUsers: {},            // { conversationId: [{ userId, userName }] }
  unreadCounts: {}            // { conversationId: count }
}
```

#### Main Actions (Synchronous)
- `conversationsRequest/Success/Failure` - List conversations
- `conversationRequest/Success/Failure` - Get single conversation
- `messagesRequest/Success/Failure` - Fetch messages for conversation
- `messageAdded` - Add message locally
- `messageUpdated` - Update message status
- `createConversationRequest/Success/Failure` - Create new conversation
- `sendMessageRequest/Success/Failure` - Send message via HTTP
- `messageReceived` - Add received message
- `userTyping` - Handle typing indication
- `clearMessages` - Clear current conversation messages

#### Real-Time Actions (Socket.IO)
- `newMessageReceived` - New message from socket
- `conversationTypingUpdate` - User typing indicators
- `conversationTypingStopped` - Stop typing
- `messagesMarkedAsRead` - Mark messages as read
- `messageDelivered` - Message delivery confirmation
- `addTypingUser` - Add user to typing list
- `removeTypingUser` - Remove user from typing list
- `setUnreadCount` - Set unread message count

#### Key Thunks (Async Actions)
```javascript
// GET /conversations?userId=:userId
fetchConversations(userId)

// GET /conversations/:conversationId
fetchConversation(conversationId)

// GET /conversations/:conversationId/messages?page=:page&limit=:limit
fetchMessages(conversationId, page, limit)

// POST /conversations
createConversation(vendorId, userId)

// POST /conversations/:conversationId/messages
sendMessage(conversationId, messageData)

// PUT /conversations/:conversationId/messages/read
markMessagesAsRead(conversationId, messageIds)
```

#### Selectors
```javascript
conversationsSelectors.selectConversations(state)
conversationsSelectors.selectCurrentConversation(state)
conversationsSelectors.selectMessages(state)
conversationsSelectors.selectTotalMessages(state)
conversationsSelectors.selectIsLoading(state)
conversationsSelectors.selectIsLoadingMessages(state)
conversationsSelectors.selectError(state)
conversationsSelectors.selectSuccessMessage(state)
conversationsSelectors.selectPagination(state)
conversationsSelectors.selectTypingUsers(state, conversationId)
conversationsSelectors.selectAllTypingUsers(state)
conversationsSelectors.selectUnreadCount(state, conversationId)
conversationsSelectors.selectAllUnreadCounts(state)
```

---

### messages Slice (messageSlice.js - Legacy)
**Location**: `/src/redux/Slices/messageSlice.js`

#### Purpose
Legacy fallback system for message management. Used alongside conversationsSlice for different message types (user-to-user chat vs. conversation-based messaging).

#### State Shape
```javascript
{
  messagesByRoom: {},          // { roomId: [messages] }
  activeRooms: [],            // [{ roomId, type, participants, lastMessage, unreadCount }]
  currentRoom: null,          // Current active room
  onlineUsers: {},            // { userId: { online, lastSeen } }
  typingUsers: {},            // { roomId: [{ userId, userName }] }
  isChatOpen: false,          // Chat UI state
  selectedRoom: null,         // Selected room in list
  loading: false,             // Loading state
  error: null,                // Error state
  settings: {
    soundEnabled: true,
    showOnlineStatus: true,
    autoOpenNewMessages: true,
    markAsReadOnOpen: true,
    maxMessagesPerRoom: 500
  }
}
```

---

## 3. SOCKET.IO IMPLEMENTATION

### Socket Manager Singleton
**Location**: `/src/Socket.js`

#### Connection Configuration
```javascript
// From .env
VITE_SOCKET_SERVICE_HOST = ws://localhost:6000
VITE_API_URL = http://localhost:8173

// Socket.IO Options
{
  path: '/',
  auth: { token: JWT_TOKEN },
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
}
```

#### Socket Manager Methods

**Connection Management**
```javascript
connect(token)                  // Connect with JWT token
disconnect()                    // Disconnect cleanly
reconnect()                     // Manual reconnection
isSocketConnected()            // Check connection status
```

**Event Listeners**
```javascript
on(event, callback)            // Listen to event
off(event, callback)           // Stop listening
notifyLocal(event, data)       // Internal event bus
```

**Message Queue**
```javascript
emit(event, data)              // Emit with queue fallback
flushMessageQueue()            // Send queued messages on reconnect
messageQueue: []               // Queue for offline messages
```

**Conversation Methods**
```javascript
joinConversation(conversationId, userId)
leaveConversation(conversationId, userId)
sendConversationMessage(conversationId, text, metadata)
startConversationTyping(conversationId)
stopConversationTyping(conversationId)
markConversationMessagesAsRead(conversationId, messageIds)
```

**Legacy Chat Methods**
```javascript
joinChatRoom(roomId)
leaveChatRoom(roomId)
sendMessage(roomId, message, recipientId)
markNotificationAsRead(notificationId)
```

#### Socket Events Handled

**Connection Events**
```
connect              - Socket connected
disconnect          - Socket disconnected
connect_error        - Connection error
reconnect           - Reconnection successful
unauthorized        - Authentication failed (token invalid)
maxReconnectAttemptsReached - Max retries exceeded
```

**Message Events**
```
receiveMessage      - New message received
messageDelivered    - Message delivered to recipient
messageRead         - Message read by recipient
userTyping          - User typing indicator
newMessage          - New message (modern)
conversationTyping  - Conversation typing indicator
conversationTypingStopped - User stopped typing
messageRead         - Messages marked as read (modern)
conversationUpdated - Conversation metadata updated
```

**Notification Events**
```
notification                - Generic notification
notification:received       - Namespaced notification
orderStatusUpdate           - Order status changed
priceDropAlert              - Price drop alert
productUpdate               - Product availability/update
```

**User Events**
```
userOnline / user-online   - User came online
userOffline / user-offline - User went offline
```

**Error Events**
```
error                       - General socket error
```

---

## 4. REST API ENDPOINTS

### Base URL
```
VITE_API_URL = http://localhost:8173
```

### Conversation Endpoints

#### List Conversations
```
GET /conversations
Params: userId (query)
Headers: Authorization: Bearer {JWT}
Returns: { payload: [...conversations] }
```

#### Get Single Conversation
```
GET /conversations/:conversationId
Headers: Authorization: Bearer {JWT}
Returns: { payload: {...conversationData} }
```

#### Get Conversation Messages
```
GET /conversations/:conversationId/messages
Params: page, limit (default: 1, 50)
Headers: Authorization: Bearer {JWT}
Returns: { payload: { messages: [...], pagination: {...} } }
```

#### Create Conversation
```
POST /conversations
Body: { vendorId, userId }
Headers: Authorization: Bearer {JWT}
Returns: { payload: {...conversationData} }
```

#### Send Message
```
POST /conversations/:conversationId/messages
Body: { text, ...metadata }
Headers: Authorization: Bearer {JWT}
Returns: { payload: {...messageData} }
```

#### Mark Messages as Read
```
PUT /conversations/:conversationId/messages/read
Body: { messageIds: [...] }
Headers: Authorization: Bearer {JWT}
Returns: { payload: [...readMessageIds] }
```

### Health Check
```
GET /health
Returns: { ...healthData }
```

---

## 5. HOOKS IMPLEMENTATION

### useConversationSocket.js (Modern - Recommended)
**Location**: `/src/hooks/useConversationSocket.js`

**Purpose**: Specialized hook for managing a single conversation's Socket.IO events.

**Parameters**
```javascript
conversationId: string  // ID of the conversation to manage
```

**Returned Methods & State**
```javascript
// Methods
sendMessage(text, metadata)      // Send message via socket & HTTP
startTyping()                     // Emit typing indicator
stopTyping()                      // Stop typing indicator
markAsRead(messageIds)           // Mark messages as read
joinConversation()               // Join conversation room
leaveConversation()              // Leave conversation room

// State
typingUsers: []                  // Current typing users
isTyping: boolean                // Any user typing?
isSocketConnected: boolean       // Socket connected?
socketManager: SocketManager     // Manager instance
```

**Lifecycle**
- Joins conversation on mount
- Sets up socket listeners
- Auto-stops typing after 3 seconds
- Cleans up on unmount

**Socket Events Subscribed**
- `newMessage` - New message received
- `conversationTyping` - User started typing
- `conversationTypingStopped` - User stopped typing
- `messageRead` - Messages marked as read
- `messageDelivered` - Message delivery confirmation

---

### useSocket.js (Legacy - Compatibility)
**Location**: `/src/hooks/useSocket.js`

**Purpose**: General-purpose socket hook for older chat room system.

**Features**
- Auto-connect on authentication
- Room management (join/leave)
- Message sending
- Online status tracking
- Typing indicators
- Notification handling
- Reconnection management

**Configuration Options**
```javascript
{
  autoConnect: true,              // Auto-connect on mount
  enableLogging: envDebug,        // Enable console logging
  reconnectOnAuthChange: true     // Reconnect on auth changes
}
```

---

## 6. AXIOS CONFIGURATION

**Location**: `/src/lib/axios.js`

### Configuration
```javascript
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});
```

### Request Interceptor
- Automatically injects JWT token into `Authorization: Bearer {token}` header
- Token source: Cookies.get('jwt') or localStorage.getItem('jwt')

### Response Interceptor (Error Handling)
```javascript
401 - Unauthorized
  Action: Remove token, redirect to /login

423 - Account Locked
  Action: Log error message

429 - Rate Limited
  Action: Log error message

502 - Service Unavailable
  Action: Log error message

Default - Generic error handling
  Action: Reject with error object
```

---

## 7. MAIN UI COMPONENT: EmbeddedChatWindow

**Location**: `/src/components/chat/EmbeddedChatWindow.jsx`

### Purpose
Main chat interface component used throughout the application.

### Props
```javascript
{
  conversationId: string,        // Conversation ID to display
  roomId: string,               // Legacy support
  roomType: 'user'|'store'|'order',
  recipient: { name, avatar }   // Recipient info for header
  className: string             // Additional CSS classes
}
```

### Features
- Messages list with auto-scroll
- Real-time typing indicators
- Connection status indicator
- Message input with auto-resize
- Unread message handling
- User action buttons (phone, video, settings)

### State Management
- Uses `useConversationSocket` for real-time updates
- Dispatches Redux actions for message fetching
- Selects Redux state for messages and typing users

### Lifecycle
1. Mount: Fetch initial messages
2. Messages received: Auto-scroll to bottom
3. Typing events: Show/hide typing indicator
4. Unmount: Leave conversation

---

## 8. MESSAGE COMPONENTS

### MessageList.jsx
**Location**: `/src/components/chat/MessageList.jsx`

Features:
- Group messages by date
- Format timestamps (Today/Yesterday/Date format)
- Message read status indicators (✓, ✓✓)
- Delivery status indicators (clock, checkmark)
- Support for different message types (text, image, file)
- Animated message entries
- Edit indicators
- User avatars

### MessageInput.jsx
**Location**: `/src/components/chat/MessageInput.jsx`

Features:
- Auto-resizing textarea (max 120px)
- File upload button (TODO: not implemented)
- Emoji button placeholder
- Send button with visual feedback
- Disabled state handling
- Enter to send, Shift+Enter for newline
- Typing indicator management

---

## 9. SOCKET MIDDLEWARE

**Location**: `/src/redux/middleware/socketMiddleware.js`

### Purpose
Bridges Socket.IO events with Redux actions.

### Redux Store Integration
- Middleware position: After thunk, before default middleware
- Ignores serialization checks for certain actions
- Handles auth state changes to setup/teardown socket

### Socket Event Handlers Setup
Triggered on:
- `auth/loginSuccess` - Setup socket listeners
- `auth/restoreAuth` - Restore socket session
- `auth/logout` - Disconnect socket

### Event-to-Action Mappings

**Message Events**
```javascript
receiveMessage     → messages/addMessage
messageDelivered   → messages/updateMessage
messageRead        → messages/updateMessage
userTyping         → messages/setTyping
```

**Notification Events**
```javascript
notification              → notifications/addNotification
orderStatusUpdate         → notifications/addNotification
priceDropAlert            → notifications/addNotification
productUpdate             → notifications/addNotification
```

**User Status Events**
```javascript
userOnline                → messages/setOnlineUsers
userOffline               → messages/setOnlineUsers
```

### Toast Notifications
- Success toasts for new messages (not from current user)
- Priority-based toasts for notifications
- Order status and price alerts
- Stock availability alerts

---

## 10. ENVIRONMENT VARIABLES

**Location**: `.env`

```javascript
// Socket Configuration
VITE_SOCKET_SERVICE_HOST=ws://localhost:6000

// API Configuration
VITE_API_GATEWAY=http://localhost:8173
VITE_API_URL=http://localhost:8173

// Development
VITE_NODE_ENV=development

// Firebase (if used)
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

// Debug Flags
VITE_DEBUG_SOCKET=true
VITE_DEBUG_NOTIFICATIONS=true

// Notification Settings
VITE_NOTIFICATION_SOUND=true
VITE_NOTIFICATION_DURATION=5000

// Chat Settings
VITE_CHAT_MAX_MESSAGES_PER_ROOM=500
VITE_CHAT_TYPING_TIMEOUT=3000
```

---

## 11. DATA FLOW DIAGRAM

### Sending a Message Flow
```
User types in MessageInput
    ↓
MessageInput.handleSendMessage()
    ↓
EmbeddedChatWindow.handleSendMessage()
    ↓
useConversationSocket.sendMessage()
    ├→ socketManager.sendConversationMessage() [Socket.IO emit]
    └→ dispatch(sendMessage(...)) [Redux thunk for HTTP POST]
    ↓
Two parallel paths:
├→ Socket: Server receives, broadcasts to other users
│   ├→ socketManager receives 'newMessage' event
│   ├→ Socket middleware dispatches to Redux
│   └→ conversationsSlice.newMessageReceived updates state
│
└→ HTTP: API POST /conversations/:id/messages
    ├→ Server stores message
    └→ Response updates local Redux state
```

### Receiving a Message Flow
```
Server emits 'newMessage' event to socket
    ↓
socketManager 'newMessage' listener triggered
    ↓
useConversationSocket handler processes it
    ↓
dispatch(newMessageReceived({...message}))
    ↓
conversationsSlice.newMessageReceived reducer
    ├→ Check for duplicates
    ├→ Add to state.messages
    └→ Update totalMessages count
    ↓
MessageList component re-renders with new message
    ↓
EmbeddedChatWindow auto-scrolls to new message
```

### Typing Indicator Flow
```
User types in input (after 0ms)
    ↓
MessageInput.handleInputChange()
    ↓
onTyping(true) callback
    ↓
EmbeddedChatWindow.handleTyping()
    ↓
useConversationSocket.startTyping()
    ↓
socketManager.startConversationTyping()
    ↓
Socket emits 'startTyping' event
    ↓
Server broadcasts to other users
    ↓
Other clients' socketManager receives 'conversationTyping'
    ↓
useConversationSocket handler → dispatch(addTypingUser(...))
    ↓
conversationsSlice.addTypingUser updates state.typingUsers[conversationId]
    ↓
TypingIndicator component displays "User is typing..."

[After 3 seconds of inactivity]
    ↓
useConversationSocket auto-calls stopTyping()
    ↓
socketManager.stopConversationTyping()
    ↓
Socket emits 'stopTyping' event → ... → removeTypingUser reducer
```

---

## 12. IDENTIFIED ISSUES & DEBUGGING NEEDS

### 1. **Duplicate Reducers/Actions Issue**
**Severity**: HIGH
**Location**: conversationsSlice.js (lines 82-142 vs 157-196)

**Problem**:
- `messageReceived` and `newMessageReceived` - Similar functionality, potential duplicates
- `userTyping` and `addTypingUser`/`conversationTypingUpdate` - Redundant implementations

**Impact**: 
- Confusion about which action to use
- Potential state inconsistencies
- Code maintenance nightmare

**Recommended Fix**:
- Consolidate to single implementation
- Use `newMessageReceived` (more semantic)
- Remove `messageReceived` action

---

### 2. **Dual Redux Slices**
**Severity**: MEDIUM
**Location**: conversations vs messages slices

**Problem**:
- Two separate Redux slices managing similar data
- conversationsSlice is modern (REST + Socket)
- messageSlice is legacy (old room system)
- Potential conflicts when both used

**Status**: Migration in progress (useConversationSocket is modern)

**Recommended Fix**:
- Migrate all code to use conversationsSlice
- Remove or archive messageSlice
- Update useSocket hook to use conversationsSlice

---

### 3. **Socket Listener Memory Leak**
**Severity**: MEDIUM
**Location**: Socket.js (setupEventListeners method)

**Problem**:
- Socket listeners attached in Socket.js setupEventListeners
- No cleanup in middleware setupSocketListeners on auth/logout
- Can accumulate listeners on reconnection

**Current Cleanup**:
- Socket middleware calls `socketManager.disconnect()` on logout
- This properly clears listeners

**Status**: Likely working, but verify cleanup on multiple auth changes

---

### 4. **Missing File Upload**
**Severity**: LOW
**Location**: MessageInput.jsx (line 105)

**Problem**:
```javascript
// TODO: Implémenter l'upload de fichiers
console.log('Upload de fichier à implémenter');
```

**Impact**: File sharing feature not functional

**Needed Implementation**:
- Multipart form submission via axios
- File type validation
- Progress tracking
- Preview generation

---

### 5. **Token Refresh Not Implemented**
**Severity**: MEDIUM
**Location**: axios.js (Response interceptor)

**Problem**:
- On 401 error, token is removed and user redirected to login
- No refresh token mechanism
- No graceful token refresh with retry

**Current Behavior**:
```javascript
case 401:
  localStorage.removeItem('jwt');
  Cookies.remove('jwt');
  window.location.href = '/login';
  break;
```

**Recommended Fix**:
- Implement refresh token endpoint
- Retry failed request after refresh
- Queue requests during token refresh

---

### 6. **Race Condition: Join Conversation**
**Severity**: MEDIUM
**Location**: useConversationSocket.js (line 46-54)

**Problem**:
- Calls `joinConversation()` if socket is already connected
- But what if conversationId changes before socket connects?
- No retry mechanism

**Current Code**:
```javascript
if (socketManager.isSocketConnected()) {
  joinConversation();
}
```

**Issue**: If socket connects AFTER hook setup, room won't be joined

**Recommended Fix**:
- Add socket connect listener
- Retry join when socket connects
- Or add dependency to setupSocketListeners effect

---

### 7. **Message ID Inconsistency**
**Severity**: MEDIUM
**Location**: Multiple files

**Problem**:
- Some messages use `_id` (MongoDB default)
- Others use `id` (frontend generated)
- Duplicate check uses both: `m._id === message._id || m.id === message.id`

**Locations**:
- conversationsSlice.js line 160, 163
- useConversationSocket.js line 155
- Message schemas inconsistent

**Recommended Fix**:
- Backend: Normalize all IDs to `_id`
- Frontend: Always normalize to `id` on receipt
- Update selector to only check one field

---

### 8. **Typing Timeout Edge Case**
**Severity**: LOW
**Location**: useConversationSocket.js (line 102-104)

**Problem**:
```javascript
typingTimeoutRef.current = setTimeout(() => {
  stopTyping();
}, 3000);
```

- If user stops typing manually before timeout, timeout still fires
- Calls stopTyping twice (shouldn't cause issues but inefficient)

**Recommended Fix**:
- Check `isTyping` state before stopping
- Prevent duplicate stops

---

### 9. **Missing Error Boundary**
**Severity**: LOW
**Location**: EmbeddedChatWindow.jsx

**Problem**:
- No error boundary for graceful error handling
- If socket fails, component might crash

**Recommended Fix**:
- Add error boundary wrapper
- Display error message to user
- Provide retry button

---

### 10. **Socket Manager Global State**
**Severity**: MEDIUM
**Location**: Socket.js singleton pattern

**Problem**:
- Single global socket instance shared across app
- Multiple connections might fight for control
- No connection pooling for multiple conversations

**Status**: Design decision, might be intentional

**Recommended for scaling**:
- Consider namespace-based connections
- Or implement connection pooling

---

## 13. SECURITY CONSIDERATIONS

### JWT Token Management
- **Good**: Tokens stored in secure HttpOnly cookies or localStorage
- **Issue**: Token in Authorization header exposed to XSS
- **Recommendation**: Use HttpOnly cookies for all token storage

### Socket Authentication
- **Good**: Token passed in auth payload
- **Issue**: Token still exposed in browser memory
- **Recommendation**: Implement refresh token rotation

### Input Validation
- **Missing**: No client-side validation before sending messages
- **Recommendation**: Add message length validation, sanitize HTML

### CORS
- **Current**: `withCredentials: true` enables cookie sharing
- **Good**: Server-side CORS validation needed

---

## 14. DEBUGGING COMMANDS

### Check Socket Connection Status
```javascript
// In browser console
import socketManager from '@/Socket';
console.log(socketManager.isSocketConnected());
console.log(socketManager.socket?.id);
```

### Check Redux State
```javascript
// Using Redux DevTools
store.getState().conversations
store.getState().messages
```

### Enable Debug Logging
```javascript
// .env
VITE_DEBUG_SOCKET=true
```

### Monitor Socket Events
```javascript
// In Socket.js, uncomment or add:
this.socket.onAny((event, ...args) => {
  console.log('🔌 Socket Event:', event, args);
});
```

---

## 15. PERFORMANCE OPTIMIZATION OPPORTUNITIES

1. **Message Pagination**: Implement lazy loading for older messages
2. **Virtual Scrolling**: Use react-window for large message lists
3. **Memoization**: Wrap MessageList with React.memo()
4. **Debounce Typing**: Debounce startTyping calls
5. **Socket Compression**: Enable compression for large payloads
6. **Message Caching**: Cache older conversations to reduce API calls
7. **Code Splitting**: Lazy load chat components

---

## 16. FUTURE IMPROVEMENTS

1. **Conversation Search**: Full-text search across conversations
2. **Message Reactions**: Add emoji reactions to messages
3. **Message Editing**: Allow editing sent messages
4. **Message Deletion**: Soft delete with "deleted" state
5. **Audio/Video Calls**: Integrate with WebRTC
6. **Message Groups**: Pin important messages, create threads
7. **User Presence**: Show "last seen" timestamps
8. **End-to-End Encryption**: Client-side encryption
9. **Read Receipts**: Group read status by user
10. **Notification Preferences**: Granular notification controls

