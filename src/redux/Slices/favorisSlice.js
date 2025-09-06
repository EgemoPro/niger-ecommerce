import { createSlice } from "@reduxjs/toolkit";

// État initial plus robuste
const initialState = {
    items: [],
    totalFavorites: 0,
    isLoading: false,
    error: null
};

export const favorisSlice = createSlice({
    name: "favoris",
    initialState,
    reducers: {
        addFavoris: (state, action) => {
            const product = action.payload;
            const existingFavorite = state.items.find(
                (item) => item.id === product.id
            );
            
            if (!existingFavorite) {
                state.items.push({
                    ...product,
                    addedAt: new Date().toISOString()
                });
                state.totalFavorites += 1;
                console.log("added to favoris", product);
            }
        },
        
        delFavoris: (state, action) => {
            const productId = action.payload;
            const initialLength = state.items.length;
            
            state.items = state.items.filter((product) => product.id !== productId);
            
            // Mise à jour du compteur si un élément a été supprimé
            if (state.items.length < initialLength) {
                state.totalFavorites = state.items.length;
                console.log("removed from favoris", productId);
            }
        },
        
        toggleFavoris: (state, action) => {
            const product = action.payload;
            const existingIndex = state.items.findIndex(
                (item) => item.id === product.id
            );
            
            if (existingIndex !== -1) {
                // Supprimer si existe
                state.items.splice(existingIndex, 1);
                state.totalFavorites -= 1;
                console.log("removed from favoris", product.id);
            } else {
                // Ajouter si n'existe pas
                state.items.push({
                    ...product,
                    addedAt: new Date().toISOString()
                });
                state.totalFavorites += 1;
                console.log("added to favoris", product);
            }
        },
        
        clearFavoris: (state) => {
            state.items = [];
            state.totalFavorites = 0;
        },
        
        setFavoris: (state, action) => {
            state.items = action.payload || [];
            state.totalFavorites = state.items.length;
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
    addFavoris,
    delFavoris,
    toggleFavoris,
    clearFavoris,
    setFavoris,
    setLoading,
    setError,
    clearError
} = favorisSlice.actions;

// Sélecteurs
export const favorisSelectors = {
    selectItems: (state) => state.favoris.items,
    selectTotalFavorites: (state) => state.favoris.totalFavorites,
    selectIsLoading: (state) => state.favoris.isLoading,
    selectError: (state) => state.favoris.error,
    selectIsFavorite: (productId) => (state) => 
        state.favoris.items.some(item => item.id === productId)
};

export default favorisSlice;
