import { createSlice } from "@reduxjs/toolkit";

export const backetSlice = createSlice({
    name: "backet",
    initialState:new Array(),
    reducers:{
        addProduct: (state, action)=>{
            state.push(action.payload) 
            console.log("full backet state", state);
        },
        delProduct: (state, action)=>{
            state.filter((product)=> product.id != action.payload)
        }
    }
})