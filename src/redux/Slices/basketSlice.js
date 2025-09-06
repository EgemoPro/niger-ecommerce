import { createSlice } from "@reduxjs/toolkit";

// État initial avec structure plus robuste
const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: false,
    error: null
};

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        addProduct: (state, action) => {
            const product = action.payload;
            const existingProduct = state.items.find(
                (item) => item.id === product.id
            );
            
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.items.push({ 
                    ...product, 
                    quantity: product.quantity || 1 
                });
            }
            
            // Recalculer les totaux
            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            console.log("add product to basket", state.items);
        },
        
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const product = state.items.find(item => item.id === id);
            
            if (product) {
                product.quantity = Math.max(0, quantity);
                
                // Supprimer si quantité = 0
                if (product.quantity === 0) {
                    state.items = state.items.filter(item => item.id !== id);
                }
                
                // Recalculer les totaux
                state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
                state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            }
        },
        
        delProduct: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((product) => product.id !== productId);
            
            // Recalculer les totaux
            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
        
        reset: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
        },
        
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        clearError: (state) => {
            state.error = null;
        }
    }
});

// Exports des actions
export const { 
    addProduct, 
    updateQuantity,
    delProduct, 
    reset, 
    setLoading, 
    setError, 
    clearError 
} = basketSlice.actions;

// Sélecteurs
export const basketSelectors = {
    selectItems: (state) => state.basket.items,
    selectTotalItems: (state) => state.basket.totalItems,
    selectTotalPrice: (state) => state.basket.totalPrice,
    selectIsLoading: (state) => state.basket.isLoading,
    selectError: (state) => state.basket.error
};

export default basketSlice;
