# ⚡ Quick Start - Socket.IO Real-Time Chat

**Get the chat working in 5 minutes**

---

## 1️⃣ Verify Backend is Ready

```bash
# Check Socket.IO server is running
curl -I http://localhost:8000/socket.io/

# Expected response: 200 OK
```

---

## 2️⃣ Check Environment Variables

```bash
# In .env or .env.local

VITE_API_URL=http://localhost:8000
VITE_SOCKET_SERVICE_HOST=http://localhost:8000  # or ws://localhost:8000
VITE_DEBUG_SOCKET=false  # Set true for detailed logs
```

---

## 3️⃣ Test in Browser

### Start the app
```bash
npm run dev
```

### Test real-time chat
1. Open `http://localhost:5173/chat` in **2 browser tabs**
2. Log in as different users in each tab
3. Click on same conversation in both tabs
4. Send a message in tab 1
5. **Check tab 2** - Message appears in real-time ✨

---

## 4️⃣ Monitor with DevTools

### Redux DevTools
```javascript
// Open browser DevTools → Redux tab
// Watch for these actions:
CONVERSATIONS/newMessageReceived
CONVERSATIONS/addTypingUser
CONVERSATIONS/removeTypingUser
CONVERSATIONS/messagesMarkedAsRead
```

### Browser Console
```
✅ "📌 Joined conversation: conv-123"
✅ "📩 New message received: {..."
✅ "✏️ User typing in conversation: {..."
```

### Network Tab (WebSocket)
```
Filter: WS
Look for:
ws://localhost:8000/socket.io/?...

Messages:
→ joinConversation
→ sendMessage
← newMessage
← conversationTyping
```

---

## 5️⃣ Test Each Feature

### Typing Indicators
1. Start typing in message input
2. Check other tab - should show "someone is typing..."
3. Stop typing - indicator disappears after 3 seconds

### Read Receipts
1. Send message from tab 1
2. Open conversation in tab 2
3. Check Redux DevTools - `read: true` should update

### Connection Recovery
1. Disable WiFi temporarily
2. Try to send message - should queue
3. Enable WiFi - message sends automatically

---

## 🔍 Quick Debug Checklist

| Issue | Debug Step |
|-------|-----------|
| Messages not appearing | Check Network tab for WebSocket connection |
| Typing not showing | Check Redux state `typingUsers` |
| Connection error | Verify `VITE_SOCKET_SERVICE_HOST` env var |
| Duplicate messages | Check Redux DevTools - should have deduplication |
| No read receipts | Verify `markAsRead()` call in console |

---

## 📚 Documentation Files

- **IMPLEMENTATION_SUMMARY.md** - Overview of what was built
- **SOCKET_IO_TESTING_GUIDE.md** - 7 detailed test scenarios
- **SOCKET_IO_IMPLEMENTATION_NOTES.md** - Architecture deep dive

---

## ✅ Success Criteria

After testing:
- [ ] Messages send and receive in real-time
- [ ] Typing indicators show/hide correctly
- [ ] Read receipts update status
- [ ] Connection recovery works
- [ ] No console errors
- [ ] Redux DevTools show correct state

---

## 🚀 Next: Run Full Test Suite

```bash
# See SOCKET_IO_TESTING_GUIDE.md for:
# - Test 1: Basic messaging
# - Test 2: Typing indicators  
# - Test 3: Read receipts
# - Test 4: Connection recovery
# - Test 5: Multiple conversations
# - Test 6: Load initial messages
# - Test 7: Pagination (WIP)
```

---

**That's it! Real-time chat is now enabled.** 🎉

Need help? Check the relevant documentation file above.
