import { io } from 'socket.io-client';

SOCKET_URL = import.meta.env.SOCKET_SERVICE_HOST;

const socket = io(SOCKET_URL,{
    autoConnect: false,
    // transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    // forceNew: true,
    rejectUnauthorized: false
});

export default socket;