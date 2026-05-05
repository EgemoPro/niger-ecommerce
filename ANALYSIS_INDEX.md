# Niger E-commerce Codebase Analysis Index

Generated: May 5, 2026

## Quick Navigation

This analysis contains comprehensive documentation of the chat/conversation system. Start here:

### 1. For Quick Lookup - Start with QUICK_REFERENCE.md
**File**: `QUICK_REFERENCE.md`
- File paths table
- Key Redux state structure
- REST API endpoints quick list
- Socket.IO events emitted/received
- Redux actions to use
- Hook usage examples
- Critical issues checklist
- Debug commands

**Best for**: Developers who need fast answers

### 2. For Comprehensive Understanding - Read CODEBASE_ANALYSIS.md
**File**: `CODEBASE_ANALYSIS.md` (16 detailed sections)

#### Contents:
1. **File Structure & Locations** - Complete file tree
2. **Redux Store Structure** - conversationsSlice detailed
3. **Socket.IO Implementation** - Full Socket manager docs
4. **REST API Endpoints** - All conversation endpoints
5. **Hooks Implementation** - useConversationSocket & useSocket
6. **Axios Configuration** - HTTP client setup
7. **Main UI Component** - EmbeddedChatWindow details
8. **Message Components** - MessageList, MessageInput
9. **Socket Middleware** - Redux bridge architecture
10. **Environment Variables** - Configuration reference
11. **Data Flow Diagram** - Send/receive/typing flows
12. **Identified Issues** - 10 problems with severity levels
13. **Security Considerations** - JWT, tokens, validation
14. **Debugging Commands** - Console snippets
15. **Performance Optimization** - Improvement opportunities
16. **Future Improvements** - Features to add

**Best for**: Understanding architecture, debugging, planning improvements

---

## Key File Locations (Absolute Paths)

### Redux State Management
- `/src/redux/Slices/conversationsSlice.js` - Main state management (496 lines)
- `/src/redux/Slices/messageSlice.js` - Legacy fallback (386 lines)
- `/src/redux/middleware/socketMiddleware.js` - Socket → Redux bridge (386 lines)
- `/src/redux/store.js` - Store configuration (69 lines)

### React Hooks
- `/src/hooks/useConversationSocket.js` - Modern conversation hook (284 lines)
- `/src/hooks/useSocket.js` - Legacy socket hook (344 lines)

### React Components
- `/src/components/chat/EmbeddedChatWindow.jsx` - Main chat UI (250 lines)
- `/src/components/chat/MessageList.jsx` - Message display (221 lines)
- `/src/components/chat/MessageInput.jsx` - Message input (158 lines)
- `/src/components/chat/TypingIndicator.jsx` - (referenced but not analyzed)

### Core Services
- `/src/Socket.js` - Socket.IO singleton manager (469 lines)
- `/src/lib/axios.js` - HTTP client with JWT (72 lines)

### Configuration
- `.env` - Environment variables (31 lines)
- `vite.config.js` - Build configuration (25 lines)

---

## Redux State Shape Reference

```javascript
// Main conversation state
state.conversations = {
  conversations: [],              // All conversations
  currentConversation: null,      // Active conversation
  messages: [],                   // Messages in current conversation
  totalMessages: 0,
  isLoading: false,
  isLoadingMessages: false,
  error: null,
  successMessage: null,
  pagination: { page, limit, total },
  
  // Real-time
  typingUsers: {},                // { conversationId: [{ userId, userName }] }
  unreadCounts: {}                // { conversationId: count }
}

// Selectors available
conversationsSelectors.selectMessages(state)
conversationsSelectors.selectTypingUsers(state, conversationId)
conversationsSelectors.selectUnreadCount(state, conversationId)
// ... and 9 more selectors
```

---

## REST API Endpoints Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/conversations` | List user conversations | Required |
| GET | `/conversations/:id` | Get single conversation | Required |
| GET | `/conversations/:id/messages` | Fetch messages (paginated) | Required |
| POST | `/conversations` | Create conversation | Required |
| POST | `/conversations/:id/messages` | Send message | Required |
| PUT | `/conversations/:id/messages/read` | Mark as read | Required |
| GET | `/health` | Server health check | Optional |

All endpoints use: `Authorization: Bearer {JWT_TOKEN}`

---

## Socket.IO Events Reference

### Client Emits (Sending)
```
joinConversation(conversationId, userId)
leaveConversation(conversationId, userId)
sendMessage(text, metadata)
startTyping(conversationId)
stopTyping(conversationId)
markAsRead(messageIds)
```

### Server Sends (Receiving)
```
newMessage(data)                    // New message in conversation
conversationTyping(data)            // User typing in conversation
conversationTypingStopped(data)     // User stopped typing
messageRead(data)                   // Messages marked as read
messageDelivered(data)              // Message delivery confirmed
```

---

## Architecture Summary

```
Browser UI Layer
  ↓
EmbeddedChatWindow Component
  ├─ Uses: useConversationSocket hook
  ├─ Dispatches: Redux actions
  └─ Selects: Redux state
    ↓
    ├─ Socket.IO Channel
    │   ├─ socketManager.sendConversationMessage()
    │   ├─ socketManager listeners
    │   └─ Socket events ↔ Redux actions
    │
    └─ HTTP Channel
        ├─ axios (with JWT interceptor)
        ├─ REST API endpoints
        └─ Redux thunks
          ↓
          Server (Remote)
          ├─ Message storage
          ├─ Event broadcasting
          └─ Business logic
```

---

## Critical Issues to Fix (Priority Order)

### HIGH: Duplicate Reducers/Actions
- Lines 82-142 vs 157-196 in conversationsSlice.js
- Consolidate `messageReceived` → `newMessageReceived`
- Remove redundant `userTyping` variant

### MEDIUM: Dual Redux Slices
- conversations vs messages both managing similar data
- Complete migration to conversationsSlice
- Archive or remove messageSlice

### MEDIUM: No Token Refresh
- 401 errors just redirect to login
- Implement refresh token flow in axios interceptor
- Retry failed requests after token refresh

### MEDIUM: Race Condition
- joinConversation not retried if socket connects late
- Add socket connect listener in useConversationSocket
- Retry join when socket becomes available

### MEDIUM: Message ID Inconsistency
- Mix of `_id` (MongoDB) and `id` (frontend)
- Normalize to single field on message receipt
- Update all duplicate checks

### LOW: Missing File Upload
- TODO at MessageInput.jsx:105
- Implement multipart form upload
- Add file validation and preview

### LOW: Typing Timeout Edge Case
- Can call stopTyping twice
- Check isTyping state before stopping
- Prevent duplicate stops

---

## Environment Variables

```
# Socket Configuration
VITE_SOCKET_SERVICE_HOST=ws://localhost:6000

# API Configuration  
VITE_API_URL=http://localhost:8173
VITE_API_GATEWAY=http://localhost:8173

# Debug
VITE_DEBUG_SOCKET=true
VITE_DEBUG_NOTIFICATIONS=true

# Chat Settings
VITE_CHAT_MAX_MESSAGES_PER_ROOM=500
VITE_CHAT_TYPING_TIMEOUT=3000

# Notifications
VITE_NOTIFICATION_SOUND=true
VITE_NOTIFICATION_DURATION=5000
```

---

## How to Use These Documents

### Scenario 1: I need to debug a message not sending
1. Check QUICK_REFERENCE.md → "Debug Checklist"
2. Read CODEBASE_ANALYSIS.md → Section 11 "Data Flow Diagram"
3. Check Socket connection in browser console
4. Verify Redux state with Redux DevTools

### Scenario 2: I need to understand how typing indicators work
1. Read CODEBASE_ANALYSIS.md → Section 11 "Typing Indicator Flow"
2. Check Socket events in QUICK_REFERENCE.md
3. Look at useConversationSocket.js (startTyping method)
4. Find Redux action: addTypingUser

### Scenario 3: I need to add a new feature
1. Review architecture in CODEBASE_ANALYSIS.md → Section 11
2. Identify which Redux slice needs changes
3. Check QUICK_REFERENCE.md for similar patterns
4. Review data flow diagram for similar features

### Scenario 4: I need to fix the duplicate actions
1. Read CODEBASE_ANALYSIS.md → Section 12 "Issue #1"
2. Review conversationsSlice.js lines 82-196
3. Consolidate to single action
4. Update all dispatch calls
5. Test with Redux DevTools

---

## Additional Resources

### Documentation in Codebase
- `QUICK_START_REALTIME_CHAT.md` - Getting started guide
- Comments in Socket.js - Connection flow
- Comments in conversationsSlice.js - Action documentation

### External Tools
- Redux DevTools Browser Extension
- React Developer Tools Browser Extension
- Socket.IO Debug: Set `VITE_DEBUG_SOCKET=true`

---

## Questions Answered by This Analysis

**Q: Where is the conversation data stored?**
A: Redux store at `state.conversations.conversations` and `state.conversations.messages`

**Q: How do real-time messages get to the UI?**
A: Socket event → socketManager listener → Redux action → State update → Component re-render

**Q: What REST endpoints do I need to hit?**
A: See QUICK_REFERENCE.md or CODEBASE_ANALYSIS.md Section 4

**Q: How do I check if the socket is connected?**
A: `socketManager.isSocketConnected()` in browser console

**Q: What happens when a message is sent?**
A: See CODEBASE_ANALYSIS.md Section 11 "Sending a Message Flow"

**Q: How are unread messages tracked?**
A: Via `state.conversations.unreadCounts[conversationId]` Redux state

**Q: What are the identified bugs?**
A: CODEBASE_ANALYSIS.md Section 12 lists 10 issues with severity levels

**Q: How do I debug a socket connection issue?**
A: CODEBASE_ANALYSIS.md Section 14 "Debugging Commands"

---

## Version Information
- Analysis Date: May 5, 2026
- Codebase: Niger E-commerce Frontend
- Framework: React + Redux + Socket.IO
- Build Tool: Vite
- HTTP Client: Axios

---

**Last Updated**: May 5, 2026
**For questions or updates**: Review the comprehensive documents or examine the source code directly.

