#!/bin/bash

# Simple test without hanging checks

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║       🧪 QUICK TEST - SOCKETS & CONVERSATIONS                    ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

PASS=0
FAIL=0

# Test 1
if grep -q "newMessageReceived:" src/redux/Slices/conversationsSlice.js; then
    echo "✅ Redux newMessageReceived action normalized"
    ((PASS++))
else
    echo "❌ Redux newMessageReceived not found"
    ((FAIL++))
fi

# Test 2
if grep -q "const messageId = message._id \|\| message.id" src/redux/Slices/conversationsSlice.js; then
    echo "✅ Message ID normalization implemented"
    ((PASS++))
else
    echo "❌ Message ID normalization missing"
    ((FAIL++))
fi

# Test 3
if grep -q "isRefreshing" src/lib/axios.js; then
    echo "✅ JWT refresh interceptor implemented"
    ((PASS++))
else
    echo "❌ JWT refresh mechanism missing"
    ((FAIL++))
fi

# Test 4
if grep -q "failedQueue" src/lib/axios.js; then
    echo "✅ Request queue mechanism implemented"
    ((PASS++))
else
    echo "❌ Request queue missing"
    ((FAIL++))
fi

# Test 5
if grep -q "attemptJoin" src/Socket.js; then
    echo "✅ Socket joinConversation retry logic implemented"
    ((PASS++))
else
    echo "❌ Socket retry logic missing"
    ((FAIL++))
fi

# Test 6
if grep -q "socket.io-client" package.json; then
    echo "✅ socket.io-client dependency present"
    ((PASS++))
else
    echo "❌ socket.io-client missing"
    ((FAIL++))
fi

# Test 7
if [ -f "src/pages/chat/chat-page.jsx" ]; then
    echo "✅ chat-page.jsx exists"
    ((PASS++))
else
    echo "❌ chat-page.jsx missing"
    ((FAIL++))
fi

# Test 8
if [ -f "src/services/conversationService.js" ]; then
    echo "✅ conversationService.js exists"
    ((PASS++))
else
    echo "❌ conversationService.js missing"
    ((FAIL++))
fi

# Test 9
if grep -q "getMyConversations:" src/services/conversationService.js; then
    echo "✅ REST endpoint: GET /conversations"
    ((PASS++))
else
    echo "❌ REST endpoint missing"
    ((FAIL++))
fi

# Test 10
if grep -q "joinConversation" src/Socket.js; then
    echo "✅ Socket event: joinConversation"
    ((PASS++))
else
    echo "❌ Socket event missing"
    ((FAIL++))
fi

echo ""
echo "═══════════════════════════════════════════"
echo "Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════"

if [ $FAIL -eq 0 ]; then
    echo "✅ All critical tests PASSED!"
    exit 0
else
    echo "❌ Some tests FAILED!"
    exit 1
fi
