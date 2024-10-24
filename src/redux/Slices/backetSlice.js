import { createSlice } from "@reduxjs/toolkit";

export const backetSlice = createSlice({
    name: "basket",
    initialState:new Array(),
    reducers:{
        addProduct: (state, action)=>{
            console.log(action);
            state.push(action.payload) 
            console.log("add product to basket", state);
        },
        setQuantity: (state, action)=>{
            console.log("set quantity from basketSlice", action);
            state.forEach((product)=>
                product.id == action.payload.id
            ? (product.quantity = action.payload.quantity)
            : product
        )
    },
    delProduct: (state, action)=>{
        state.filter((product)=> product.id != action.payload)
        console.log("remove product from basketSlice", action);
        }
    }
})