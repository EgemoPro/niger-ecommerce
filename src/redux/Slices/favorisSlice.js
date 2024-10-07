import { createSlice } from "@reduxjs/toolkit";

export const favoriSlice = createSlice({
    name: "favoris",
    initialState:[],
    reducers:{
        addFavoris: (state, action)=>{
            state.push(action.payload) 
            console.log("added to favoris", action.payload);
        },
        delFavoris: (state, action)=>{
            console.log("remove from favoris", action.payload);
            state.filter((product)=> product.id != action.payload)
        }
    }
})