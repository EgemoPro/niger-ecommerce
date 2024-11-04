import { createSlice } from "@reduxjs/toolkit";

export const backetSlice = createSlice({
    name: "basket",
    initialState: new Array(),
    reducers: {
        addProduct: (state, action) => {
            const existingProduct = state.find(
                (product) => product.id === action.payload.id
            );
            
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.push(action.payload);
            }
            console.log("add product to basket", state);
        },
        reset: (state, action) => {
            state.splice(0, state.length);
            
        },
        delProduct: (state, action) => {
            return state.filter((product) => product.id !== action.payload);
        }
    }
});
