#!/bin/bash

# 🧪 TEST SUITE - Socket.IO Real-Time Chat Integration
# Phase Test 1 & 2 - Quick Start + Manual Tests
# Created: May 5, 2026

set -e

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║               🧪 TEST SUITE - PHASE TEST 1: QUICK START                    ║"
echo "║                                                                            ║"
echo "║             Socket.IO Real-Time Chat Integration Testing                   ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
test_check() {
  local test_name="$1"
  local command="$2"
  local expected="$3"
  
  echo -e "${BLUE}🔍 TEST: ${test_name}${NC}"
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}: $test_name"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}❌ FAILED${NC}: $test_name"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
  echo ""
}

file_exists() {
  local file="$1"
  echo -e "${YELLOW}📄 Checking file: ${file}${NC}"
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ File exists${NC}: $file"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}❌ File missing${NC}: $file"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

contains_pattern() {
  local file="$1"
  local pattern="$2"
  local description="$3"
  
  echo -e "${YELLOW}🔎 Checking: ${description}${NC}"
  if grep -q "$pattern" "$file" 2>/dev/null; then
    echo -e "${GREEN}✅ Found${NC}: $description"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}❌ Not found${NC}: $description"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

echo "═════════════════════════════════════════════════════════════════════════════"
echo "PHASE TEST 1.1: File Existence Checks"
echo "═════════════════════════════════════════════════════════════════════════════"
echo ""

file_exists "src/Socket.js"
file_exists "src/hooks/useConversationSocket.js"
file_exists "src/redux/Slices/conversationsSlice.js"
file_exists "src/components/chat/EmbeddedChatWindow.jsx"
file_exists "src/services/conversationService.js"
file_exists "src/lib/axios.js"
file_exists "vite.config.js"

echo ""
echo "═════════════════════════════════════════════════════════════════════════════"
echo "PHASE TEST 1.2: Socket.IO Methods Check"
echo "═════════════════════════════════════════════════════════════════════════════"
echo ""

contains_pattern "src/Socket.js" "joinConversation" "Socket.js - joinConversation method"
contains_pattern "src/Socket.js" "leaveConversation" "Socket.js - leaveConversation method"
contains_pattern "src/Socket.js" "sendConversationMessage" "Socket.js - sendConversationMessage method"
contains_pattern "src/Socket.js" "startConversationTyping" "Socket.js - startConversationTyping method"
contains_pattern "src/Socket.js" "stopConversationTyping" "Socket.js - stopConversationTyping method"
contains_pattern "src/Socket.js" "markConversationMessagesAsRead" "Socket.js - markConversationMessagesAsRead method"

echo ""
echo "═════════════════════════════════════════════════════════════════════════════"
echo "PHASE TEST 1.3: Event Listeners Check"
echo "═════════════════════════════════════════════════════════════════════════════"
echo ""

contains_pattern "src/Socket.js" "socket.on('newMessage'" "Socket listener - newMessage"
contains_pattern "src/Socket.js" "socket.on('conversationTyping'" "Socket listener - conversationTyping"
contains_pattern "src/Socket.js" "socket.on('conversationTypingStopped'" "Socket listener - conversationTypingStopped"
contains_pattern "src/Socket.js" "socket.on('messageRead'" "Socket listener - messageRead"
contains_pattern "src/Socket.js" "socket.on('conversationUpdated'" "Socket listener - conversationUpdated"

echo ""
echo "═════════════════════════════════════════════════════════════════════════════"
echo "PHASE TEST 1.4: Redux Actions Check"
echo "═════════════════════════════════════════════════════════════════════════════"
echo ""

contains_pattern "src/redux/Slices/conversationsSlice.js" "newMessageReceived" "Redux action - newMessageReceived"
contains_pattern "src/redux/Slices/conversationsSlice.js" "messagesMarkedAsRead" "Redux action - messagesMarkedAsRead"
contains_pattern "src/redux/Slices/conversationsSlice.js" "messageDelivered" "Redux action - messageDelivered"
contains_pattern "src/redux/Slices/conversationsSlice.js" "addTypingUser" "Redux action - addTypingUser"
contains_pattern "src/redux/Slices/conversationsSlice.js" "removeTypingUser" "Redux action - removeTypingUser"

echo ""
echo "═════════════════════════════════════════════════════════════════════════════"
echo "PHASE TEST 1.5: Hook Implementation Check"
echo "═════════════════════════════════════════════════════════════════════════════"
echo ""

contains_pattern "src/hooks/useConversationSocket.js" "useEffect" "useConversationSocket - useEffect hook"
contains_pattern "src/hooks/useConversationSocket.js" "useRef" "useConversationSocket - useRef for typing debounce"
contains_pattern "src/hooks/useConversationSocket.js" "dispatch" "useConversationSocket - Redux dispatch"
contains_pattern "src/hooks/useConversationSocket.js" "3000" "useConversationSocket - 3 second typing timeout"

echo ""
echo "═════════════════════════════════════════════════════════════════════════════"
echo "PHASE TEST 1.6: Conversation Service Check"
echo "═════════════════════════════════════════════════════════════════════════════"
echo ""

contains_pattern "src/services/conversationService.js" "getOrCreateConversation" "Service - getOrCreateConversation"
contains_pattern "src/services/conversationService.js" "getMyConversations" "Service - getMyConversations"
contains_pattern "src/services/conversationService.js" "getMessages" "Service - getMessages"
contains_pattern "src/services/conversationService.js" "sendMessage" "Service - sendMessage"
contains_pattern "src/services/conversationService.js" "markMessagesAsRead" "Service - markMessagesAsRead"

echo ""
echo "═════════════════════════════════════════════════════════════════════════════"
echo "PHASE TEST 1.7: Configuration Check"
echo "═════════════════════════════════════════════════════════════════════════════"
echo ""

contains_pattern "vite.config.js" "proxy:" "Vite - proxy configuration"
contains_pattern "vite.config.js" "/api" "Vite - /api proxy path"
contains_pattern "src/lib/axios.js" "interceptors.response" "Axios - response interceptor"
contains_pattern "src/lib/axios.js" "401" "Axios - 401 error handling"

echo ""
echo "═════════════════════════════════════════════════════════════════════════════"
echo "📊 TEST RESULTS SUMMARY"
echo "═════════════════════════════════════════════════════════════════════════════"
echo ""

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
PASS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo -e "Total Tests Run: ${BLUE}${TOTAL_TESTS}${NC}"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo -e "Success Rate: ${BLUE}${PASS_RATE}%${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                                                                            ║${NC}"
  echo -e "${GREEN}║                  ✅ ALL TESTS PASSED - READY FOR RUNNING                   ║${NC}"
  echo -e "${GREEN}║                                                                            ║${NC}"
  echo -e "${GREEN}║                   🚀 Next Steps (PHASE TEST 1: Quick Start):               ║${NC}"
  echo -e "${GREEN}║                                                                            ║${NC}"
  echo -e "${GREEN}║                   1. Run: npm run dev                                      ║${NC}"
  echo -e "${GREEN}║                   2. Open: http://localhost:5173/chat (2 tabs)            ║${NC}"
  echo -e "${GREEN}║                   3. Send a message in Tab 1                               ║${NC}"
  echo -e "${GREEN}║                   4. Verify it appears instantly in Tab 2                  ║${NC}"
  echo -e "${GREEN}║                   5. Check console for Socket logs                         ║${NC}"
  echo -e "${GREEN}║                   6. Check Redux DevTools for action dispatch              ║${NC}"
  echo -e "${GREEN}║                                                                            ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║                                                                            ║${NC}"
  echo -e "${RED}║                  ❌ SOME TESTS FAILED - REVIEW NEEDED                       ║${NC}"
  echo -e "${RED}║                                                                            ║${NC}"
  echo -e "${RED}║                   Please check the failed tests above and verify:           ║${NC}"
  echo -e "${RED}║                   • File paths are correct                                  ║${NC}"
  echo -e "${RED}║                   • All necessary files are created                         ║${NC}"
  echo -e "${RED}║                   • Code patterns match expected implementations             ║${NC}"
  echo -e "${RED}║                                                                            ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  exit 1
fi
