import { applyMiddleware, configureStore} from '@reduxjs/toolkit'
import { backetSlice } from './Slices/backetSlice'
import { dataSlice } from './Slices/initialData'
import { favoriSlice } from './Slices/favorisSlice'
import {enableMapSet} from 'immer'
// import ReduxThunk from 'redux-thunk'

// const middlewares = [ReduxThunk]

enableMapSet()

export const store = configureStore({
    reducer:{
        basket: backetSlice.reducer,
        data : dataSlice.reducer,
        favoris: favoriSlice.reducer
    },
    // middleware: compose(applyMiddleware(...middlewares))
})