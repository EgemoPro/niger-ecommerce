import {  configureStore} from '@reduxjs/toolkit';
import { backetSlice } from './Slices/basketSlice';
import { dataSlice } from './Slices/initialData';
import { favoriSlice } from './Slices/favorisSlice';
import authSlice from './Slices/authSlice'
import userSlice from './Slices/userSlice';
import {enableMapSet} from 'immer'

// import ReduxThunk from 'redux-thunk'

// const middlewares = [ReduxThunk]

enableMapSet()

export const store = configureStore({
    reducer:{
        basket: backetSlice.reducer,
        data : dataSlice.reducer,
        favoris: favoriSlice.reducer,
        auth: authSlice.reducer,
        user: userSlice.reducer
    },
    
    // middleware: compose(applyMiddleware(...middlewares))
},window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())