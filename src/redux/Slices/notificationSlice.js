import { createSlice } from "@reduxjs/toolkit"
import api from "../../lib/axios"

const initialState = {
    basket : 0,
    message : 0
}

const notification = createSlice({
    name : "notification",
    initialState,
    reducers : {
        setBasket: (state, action) =>{
            state.basket = action.payload
        },
        setMessage : (state, action) =>{
            state.message = action.payload
        }
    }

})


export const {setDarkMode, setProductPage} = notification.actions;

export default notification