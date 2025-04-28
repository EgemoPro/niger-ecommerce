import { configureStore } from '@reduxjs/toolkit';
import { backetSlice } from './Slices/basketSlice';
import { dataSlice } from './Slices/initialData';
import { favoriSlice } from './Slices/favorisSlice';
import authSlice from './Slices/authSlice'
import userSlice from './Slices/userSlice';
import { enableMapSet } from 'immer'
import SettingSlice from './Slices/settingsSlice';
import shopReducer from './Slices/shopSlice';
import productReducer from './Slices/productSlice';
import { thunk } from 'redux-thunk'


// const middlewares = [ReduxThunk]

enableMapSet()

export const store = configureStore({
    reducer: {
        basket: backetSlice.reducer,
        data: dataSlice.reducer,
        favoris: favoriSlice.reducer,
        auth: authSlice.reducer,
        user: userSlice.reducer,
        settings: SettingSlice.reducer,
        shop: shopReducer.reducer,
        product: productReducer.reducer,
    },
    middleware: md => md().concat(thunk),
    // middleware: compose(applyMiddleware(...middlewares))
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())