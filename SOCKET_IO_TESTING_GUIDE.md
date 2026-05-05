# 🚀 Socket.IO Real-Time Chat Integration - Testing Guide

**Date**: May 2026  
**Implementation**: Complete real-time Socket.IO chat integration  
**Status**: ✅ Ready for testing

---

## 📋 What Was Implemented

### 1. Socket.js Enhancements
Added conversation-specific Socket.IO methods:
- `joinConversation(conversationId, userId)` - Enter a conversation
- `leaveConversation(conversationId, userId)` - Exit a conversation
- `sendConversationMessage(conversationId, text, metadata)` - Send real-time messages
- `startConversationTyping(conversationId)` - Signal typing
- `stopConversationTyping(conversationId)` - Stop typing signal
- `markConversationMessagesAsRead(conversationId, messageIds)` - Mark messages as read

### 2. conversationsSlice.js Enhancements
Added Redux state and actions for real-time updates:
- `newMessageReceived` - Receive messages in real-time
- `addTypingUser` / `removeTypingUser` - Track who's typing
- `messagesMarkedAsRead` - Update read status
- `messageDelivered` - Track delivery
- `conversationTypingUpdate` - Update typing indicators
- New selectors for typing users and unread counts

### 3. useConversationSocket Hook (NEW)
Custom hook managing Socket.IO subscription per conversation:
```javascript
const {
  sendMessage,      // Send a message
  startTyping,      // Emit typing event
  stopTyping,       // Stop typing event
  markAsRead,       // Mark messages as read
  typingUsers,      // Array of users typing
  isTyping,         // Boolean if anyone is typing
  isSocketConnected // Connection status
} = useConversationSocket(conversationId);
```

### 4. EmbeddedChatWindow Refactoring
- Integrated `useConversationSocket` hook
- Replaced legacy roomId with conversationId
- Loads messages via Redux thunk (REST API)
- Real-time updates via Socket.IO
- Typing indicators display
- Read receipts handling

---

## 🧪 Testing Scenarios

### Prerequisites
- Backend API running at `http://localhost:8000`
- Socket.IO server connected
- Two test user accounts ready

### Test 1: Basic Message Sending ✅

**Steps:**
1. Open `/chat` page in browser 1
2. Open `/chat` page in browser 2 (different user)
3. In browser 1: Click on a conversation → Send a message
4. **Expected:** Message appears instantly in browser 2 without page refresh

**What to Check:**
- ✅ Message appears in both windows
- ✅ Socket connection indicator shows "En ligne"
- ✅ No HTTP request visible (using Socket.IO real-time)

---

### Test 2: Typing Indicators ✅

**Steps:**
1. Keep both browsers open with same conversation
2. In browser 1: Start typing in the message input
3. Watch browser 2 message area
4. Stop typing and wait 3 seconds

**Expected:**
- ✅ "Quelqu'un is typing..." appears after first character
- ✅ Indicator disappears 3 seconds after typing stops
- ✅ No typing indicator if user is author

**Debug:**
- Check browser console for `startTyping`/`stopTyping` emissions
- Verify `conversationTyping` event in Network → WebSocket

---

### Test 3: Read Receipts ✅

**Steps:**
1. In browser 1: Send a message
2. In browser 2: Message appears with `read: false` status
3. Click on the conversation to open chat
4. Check Redux DevTools for state updates

**Expected:**
- ✅ Message status changes to `read: true`
- ✅ `markAsRead` action dispatched
- ✅ HTTP PUT request to `/conversations/:id/messages/read`

---

### Test 4: Connection Recovery ✅

**Steps:**
1. Open chat in browser with active conversation
2. Disable WiFi/Network connection temporarily
3. Try to send a message
4. Re-enable network
5. Check message delivery

**Expected:**
- ✅ UI shows "⚠️ Connexion perdue" banner
- ✅ Send button disabled during disconnect
- ✅ After reconnect: Message queued and sent automatically
- ✅ Or error toast if backend rejects

---

### Test 5: Multiple Conversations ✅

**Steps:**
1. Open conversation A in both browsers
2. Send message in conversation A (browser 1)
3. Switch to conversation B (both browsers)
4. Send message in conversation B (browser 1)
5. Switch back to conversation A

**Expected:**
- ✅ Each conversation has its own message history
- ✅ Typing indicators are per-conversation
- ✅ No cross-conversation messages
- ✅ Redux state properly segregated

---

### Test 6: Load Initial Messages ✅

**Steps:**
1. Go to `/chat` page (new visit)
2. Wait for conversations list to load
3. Click on a conversation
4. Check Network tab

**Expected:**
- ✅ `GET /conversations?userId=:userId` → List of conversations
- ✅ `GET /conversations/:id/messages?page=1&limit=50` → Message history
- ✅ Messages sorted by timestamp (oldest first)
- ✅ Latest messages visible at bottom

---

### Test 7: Pagination (Future) ⏳

**Steps:**
1. In a conversation with 50+ messages
2. Scroll to top of message list
3. Wait for more messages to load

**Expected:**
- ✅ More messages load (pagination support)
- ✅ Infinite scroll or "Load more" button
- ✅ No duplicate messages

**Note:** Currently loads 50 messages/page. Pagination UI not yet implemented.

---

## 🔍 Debugging Checklist

### Redux DevTools
```javascript
// Check current state
state.conversations.messages        // All loaded messages
state.conversations.typingUsers     // { conversationId: [{userId, userName}] }
state.conversations.unreadCounts    // { conversationId: number }
state.conversations.currentConversation
```

### Browser Console
Monitor these logs:
```javascript
✅ Socket.js:
- "📌 Joined conversation: ..."
- "📌 Left conversation: ..."
- "💬 Message received: ..."
- "✏️ User typing in conversation: ..."

✅ useConversationSocket:
- "📩 New message received: ..."

✅ Errors:
- "Cannot join conversation: missing conversationId"
- "Impossible d'envoyer un message: utilisateur non connecté"
```

### Network Tab
Look for WebSocket connections:
```
ws://localhost:8000/socket.io/?...
  Events: joinConversation, sendMessage, startTyping, etc.
```

And HTTP calls:
```
GET /conversations                  → 200 OK
GET /conversations/:id/messages     → 200 OK
POST /conversations/:id/messages    → 201 Created
PUT /conversations/:id/messages/read → 200 OK
```

---

## ⚠️ Known Limitations

| Issue | Impact | Workaround |
|-------|--------|-----------|
| Pagination UI not yet built | Can't load older messages | Max 50 messages/conversation |
| No message editing | Edit not supported | Delete and re-send |
| No message deletion | Delete not supported | Already implemented in Redux |
| No file attachments | Media not supported | Backend may support it |
| No video/audio calls | Calls not possible | Phone/Video buttons are placeholders |

---

## 🔗 Code Files Modified

### Created
- `src/hooks/useConversationSocket.js` - NEW

### Modified
- `src/Socket.js` - Added conversation methods + event listeners
- `src/redux/Slices/conversationsSlice.js` - Added real-time actions + state
- `src/components/chat/EmbeddedChatWindow.jsx` - Integrated new hook

### Not Modified (Still Working)
- `src/pages/chat/chat-page.jsx` - Already using fetchConversations()
- `src/components/chat/MessageList.jsx`
- `src/components/chat/MessageInput.jsx`
- `src/components/chat/TypingIndicator.jsx`

---

## 🚀 Performance Considerations

### Socket.IO Optimization
- ✅ Auto-debounced typing (3s timeout)
- ✅ Prevents duplicate messages with ID checking
- ✅ Automatic reconnection with exponential backoff
- ✅ Message queue for offline messages

### Redux Performance
- ✅ Selector memoization with conversationId
- ✅ No full state clones on each update
- ✅ Proper reducer patterns with Immer

### UI Performance
- ✅ Framer Motion animations optimized
- ✅ Auto-scroll only on new messages
- ✅ Lazy loading of messages (50/page)

---

## 📞 Troubleshooting

### "Socket not connected" errors
**Cause:** Socket.IO connection not established
**Fix:**
1. Check `VITE_SOCKET_SERVICE_HOST` env variable
2. Verify backend Socket.IO server running
3. Check browser Network tab for WebSocket failures
4. Check auth token is present (from Login)

### Messages not appearing in real-time
**Cause:** Socket listener not setup
**Fix:**
1. Verify `useConversationSocket` hook is called
2. Check Redux actions dispatched (Redux DevTools)
3. Verify `conversationId` is correct
4. Check browser console for listener setup logs

### Typing indicators not showing
**Cause:** Wrong event name or Redux state not updated
**Fix:**
1. Check emission: `socketManager.startConversationTyping()`
2. Verify listener: `socketManager.on('conversationTyping')`
3. Check Redux dispatch of `addTypingUser` action
4. Verify selector `selectTypingUsers` works

### Read receipts not updating
**Cause:** Missing HTTP call or Redux dispatch
**Fix:**
1. Check `markAsRead()` is called in hook
2. Verify HTTP `PUT /conversations/:id/messages/read` request
3. Check Redux dispatch of `messagesMarkedAsRead` action
4. Verify message IDs match format

---

## 📊 Test Coverage

| Feature | Manual Test | Automated Test | Status |
|---------|------------|-----------------|--------|
| Send message | ✅ Test 1 | ⏳ Pending | Ready |
| Typing indicators | ✅ Test 2 | ⏳ Pending | Ready |
| Read receipts | ✅ Test 3 | ⏳ Pending | Ready |
| Connection recovery | ✅ Test 4 | ⏳ Pending | Ready |
| Multi-conversation | ✅ Test 5 | ⏳ Pending | Ready |
| Load messages | ✅ Test 6 | ⏳ Pending | Ready |
| Pagination | ⏳ Test 7 | ❌ Not ready | Pending |

---

## 🎯 Next Steps

### Immediate (This Week)
1. ✅ Run all manual tests above
2. ✅ Verify no console errors
3. ✅ Check Redux DevTools for state correctness
4. 📝 Document any discrepancies

### Short-term (Next Week)
1. Implement message pagination UI
2. Add message search functionality
3. Add conversation search/filter
4. Implement read receipts UI (checkmarks)

### Long-term (Future)
1. Message editing (PATCH)
2. Message deletion (DELETE)
3. File/media attachments
4. Voice/video calls (separate integration)
5. Message reactions (emoji)
6. Conversation pinning
7. Conversation muting

---

## 📝 Test Report Template

```markdown
# Test Report - [Date]

## Environment
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Backend: [localhost:8000]
- Users: [User1, User2]

## Tests Passed
- [ ] Test 1: Basic messaging
- [ ] Test 2: Typing indicators
- [ ] Test 3: Read receipts
- [ ] Test 4: Connection recovery
- [ ] Test 5: Multiple conversations
- [ ] Test 6: Load messages
- [ ] Test 7: Pagination

## Issues Found
1. [Issue description]
   - Steps to reproduce
   - Expected result
   - Actual result
   - Console logs

## Performance Notes
- Message load time: [X ms]
- Socket connection time: [X ms]
- Real-time message latency: [X ms]

## Overall Status
✅ All tests passed / ⚠️ Issues found / ❌ Critical failures
```

---

**Ready to test! Run the manual tests above and report any issues.** 🚀
