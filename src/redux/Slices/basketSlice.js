import { createSlice } from "@reduxjs/toolkit";
import { BasketItemSchema, BasketStateSchema } from "../schemas/index";
import { calculateCartTotals, validatePayload } from "../utils/index";
import { logger } from "../../services/logger";

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
            try {
                const product = action.payload;
                
                // Validation du produit
                const validation = validatePayload(BasketItemSchema, product, 'addProduct');
                if (!validation.success) {
                    state.error = 'Produit invalide';
                    logger.error('Invalid product in addProduct', validation.error);
                    return;
                }
                
                const validatedProduct = validation.data;
                const existingProduct = state.items.find(
                    (item) => item.id === validatedProduct.id
                );
                
                if (existingProduct) {
                    existingProduct.quantity += validatedProduct.quantity || 1;
                    logger.debug(`Product quantity updated: ${validatedProduct.id}`, { 
                        newQuantity: existingProduct.quantity 
                    });
                } else {
                    state.items.push({ 
                        ...validatedProduct, 
                        quantity: validatedProduct.quantity || 1 
                    });
                    logger.logAddToCart(validatedProduct.id, validatedProduct.quantity || 1);
                }
                
                // Recalculer les totaux avec utilitaire
                const totals = calculateCartTotals(state.items);
                state.totalItems = totals.totalItems;
                state.totalPrice = totals.totalPrice;
                state.error = null;
                
                logger.logCartUpdate(totals);
            } catch (error) {
                state.error = 'Erreur lors de l\'ajout du produit';
                logger.error('Error in addProduct reducer', error);
            }
        },
        
        updateQuantity: (state, action) => {
            try {
                const { id, quantity } = action.payload;
                
                // Validation de la quantité
                if (typeof quantity !== 'number' || quantity < 0) {
                    state.error = 'Quantité invalide';
                    logger.warn('Invalid quantity in updateQuantity', { id, quantity });
                    return;
                }
                
                const product = state.items.find(item => item.id === id);
                
                if (product) {
                    const oldQuantity = product.quantity;
                    product.quantity = Math.max(0, quantity);
                    
                    // Supprimer si quantité = 0
                    if (product.quantity === 0) {
                        state.items = state.items.filter(item => item.id !== id);
                        logger.logRemoveFromCart(id);
                    } else {
                        logger.debug(`Product quantity changed: ${id}`, { 
                            from: oldQuantity, 
                            to: product.quantity 
                        });
                    }
                    
                    // Recalculer les totaux avec utilitaire
                    const totals = calculateCartTotals(state.items);
                    state.totalItems = totals.totalItems;
                    state.totalPrice = totals.totalPrice;
                    state.error = null;
                    
                    logger.logCartUpdate(totals);
                } else {
                    state.error = 'Produit non trouvé dans le panier';
                    logger.warn('Product not found in updateQuantity', { id });
                }
            } catch (error) {
                state.error = 'Erreur lors de la mise à jour de la quantité';
                logger.error('Error in updateQuantity reducer', error);
            }
        },
        
        delProduct: (state, action) => {
            try {
                const productId = action.payload;
                
                // Validation de l'ID
                if (!productId) {
                    state.error = 'ID produit invalide';
                    logger.warn('Invalid product ID in delProduct', { productId });
                    return;
                }
                
                const productExists = state.items.some(item => item.id === productId);
                
                if (productExists) {
                    state.items = state.items.filter((product) => product.id !== productId);
                    logger.logRemoveFromCart(productId);
                    
                    // Recalculer les totaux avec utilitaire
                    const totals = calculateCartTotals(state.items);
                    state.totalItems = totals.totalItems;
                    state.totalPrice = totals.totalPrice;
                    state.error = null;
                    
                    logger.logCartUpdate(totals);
                } else {
                    state.error = 'Produit non trouvé dans le panier';
                    logger.warn('Product not found in delProduct', { productId });
                }
            } catch (error) {
                state.error = 'Erreur lors de la suppression du produit';
                logger.error('Error in delProduct reducer', error);
            }
        },
        
        reset: (state) => {
            try {
                state.items = [];
                state.totalItems = 0;
                state.totalPrice = 0;
                state.error = null;
                logger.debug('Basket reset');
            } catch (error) {
                logger.error('Error in reset reducer', error);
            }
        },
        
        setLoading: (state, action) => {
            state.isLoading = action.payload;
            logger.debug('Basket loading state changed', { isLoading: action.payload });
        },
        
        setError: (state, action) => {
            state.error = action.payload;
            logger.warn('Basket error set', { error: action.payload });
        },
        
        clearError: (state) => {
            state.error = null;
            logger.debug('Basket error cleared');
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
