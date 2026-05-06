import { configureStore } from '@reduxjs/toolkit';
import { basketSlice } from './Slices/basketSlice';
import dataSlice from './Slices/initialData';
import { favorisSlice } from './Slices/favorisSlice';
import { followingSlice } from './Slices/followingSlice';
import conversationsSlice from './Slices/conversationsSlice';
import authSlice from './Slices/authSlice'
import userSlice from './Slices/userSlice';
import profileSlice from './Slices/profileSlice';
import ordersSlice from './Slices/ordersSlice';
import commentsSlice from './Slices/commentsSlice';
import { enableMapSet } from 'immer'
import SettingSlice from './Slices/settingsSlice';
import shopReducer from './Slices/shopSlice';
import productReducer from './Slices/productSlice';
import notificationSlice from './Slices/notificationSlice';
import messageSlice from './Slices/messageSlice';
import socketMiddleware from './middleware/socketMiddleware';


enableMapSet()

export const store = configureStore({
    reducer: {
        basket: basketSlice.reducer,
        data: dataSlice.reducer,
        favoris: favorisSlice.reducer,
        following: followingSlice.reducer,
        conversations: conversationsSlice.reducer,
        auth: authSlice.reducer,
        user: userSlice.reducer,
        profile: profileSlice.reducer,
        orders: ordersSlice.reducer,
        comments: commentsSlice.reducer,
        settings: SettingSlice.reducer,
        shop: shopReducer.reducer,
        product: productReducer.reducer,
        notifications: notificationSlice.reducer,
        messages: messageSlice.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                // Ignorer les actions Socket qui peuvent contenir des fonctions
                ignoredActions: [
                    'SOCKET_SEND_MESSAGE',
                    'SOCKET_JOIN_ROOM',
                    'SOCKET_LEAVE_ROOM',
                    'SOCKET_MARK_NOTIFICATION_READ'
                ],
                // Ignorer les chemins avec des dates/timestamps
                ignoredPaths: [
                    'notifications.notifications.timestamp',
                    'messages.messagesByRoom',
                    'messages.onlineUsers',
                    'orders.orders',
                    'comments.currentProductComments'
                ]
            }
        })
        .concat(socketMiddleware),
    devTools: process.env.NODE_ENV !== 'production' && {
        name: 'Niger E-commerce Frontend',
        trace: true,
        traceLimit: 25
    }
});
