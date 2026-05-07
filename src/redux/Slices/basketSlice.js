import { createSlice } from "@reduxjs/toolkit";
import { BasketItemSchema, BasketStateSchema } from "../schemas/index";
import { calculateCartTotals, validatePayload } from "../utils/index";
import { logger } from "../../services/logger";

// ============================================
// CONSTANTES LOCALSTORAGE
// ============================================

const LOCALSTORAGE_KEY = 'quickcart_products';

/**
 * Sauvegarde le panier dans localStorage
 * @param {Array} items - Items du panier Redux
 */
const saveToLocalStorage = (items) => {
    try {
        const data = items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            attributes: item.attributes || {}
        }));
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
        logger.debug('Basket saved to localStorage', { count: items.length });
    } catch (error) {
        logger.error('Error saving basket to localStorage', error);
    }
};

/**
 * Charge le panier depuis localStorage
 * @returns {Array} Items chargés depuis localStorage
 */
const loadFromLocalStorage = () => {
    try {
        const data = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        logger.error('Error loading basket from localStorage', error);
        return [];
    }
};

/**
 * Efface le panier de localStorage
 */
const clearLocalCart = () => {
    try {
        localStorage.removeItem(LOCALSTORAGE_KEY);
        logger.debug('Basket cleared from localStorage');
    } catch (error) {
        logger.error('Error clearing localStorage', error);
    }
};

// ============================================
// INITIAL STATE
// ============================================

// État initial avec structure plus rigide
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
                
                // Rechercher produit existant avec même ID et même attributes
                const existingProduct = state.items.find(
                    (item) => 
                        item.id === validatedProduct.id && 
                        JSON.stringify(item.attributes) === JSON.stringify(validatedProduct.attributes)
                );
                
                if (existingProduct) {
                    existingProduct.quantity += validatedProduct.quantity || 1;
                    logger.debug(`Product quantity updated: ${validatedProduct.id}`, { 
                        newQuantity: existingProduct.quantity 
                    });
                } else {
                    // Stocker les infos nécessaires pour l'API order
                    state.items.push({ 
                        id: validatedProduct.id,
                        name: validatedProduct.name,
                        price: validatedProduct.price,
                        quantity: validatedProduct.quantity || 1,
                        image: validatedProduct.image,
                        storeId: validatedProduct.storeId,   // Pour grouper par boutique
                        sku: validatedProduct.sku,          // Code produit
                        attributes: validatedProduct.attributes  // { color, size }
                    });
                    logger.logAddToCart(validatedProduct.id, validatedProduct.quantity || 1);
                }
                
                // Recalculer les totaux avec utilitaire
                const totals = calculateCartTotals(state.items);
                state.totalItems = totals.totalItems;
                state.totalPrice = totals.totalPrice;
                state.error = null;
                
                // Sauvegarder dans localStorage après modification
                saveToLocalStorage(state.items);
                
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
                    
                    // Sauvegarder dans localStorage après modification
                    saveToLocalStorage(state.items);
                    
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
                    
                    // Sauvegarder dans localStorage après modification
                    saveToLocalStorage(state.items);
                    
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
                
                // Effacer localStorage aussi
                clearLocalCart();
                
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
        },
        
        // Sync depuis localStorage (sans validation stricte)
        setItems: (state, action) => {
            const { items, totalItems, totalPrice } = action.payload;
            state.items = items;
            state.totalItems = totalItems;
            state.totalPrice = totalPrice;
            logger.debug('Basket items synced from localStorage', { count: items.length });
        }
    }
});

// ============================================
// ASYNC THUNKS - SYNC AVEC LOCALSTORAGE
// ============================================

/**
 * Charge le panier depuis localStorage et met à jour Redux
 * Note: On ne fait que sauvegarder les IDs - les détails seront fetch depuis l'API quand l'utilisateur va sur /orders
 */
export const loadBasketFromStorage = () => (dispatch, getState) => {
    try {
        const localItems = loadFromLocalStorage();
        const currentItems = getState().basket.items;
        
        if (localItems.length > 0) {
            // Créer une nouvelle liste pour éviter l'immutabilité
            const newItems = [...currentItems];
            
            // Fusionner les items locaux avec l'état actuel (sans validation stricte)
            localItems.forEach(item => {
                // Chercher si le produit existe déjà
                const existingIndex = newItems.findIndex(
                    i => i.id === item.productId && 
                    JSON.stringify(i.attributes) === JSON.stringify(item.attributes || {})
                );
                
                if (existingIndex >= 0) {
                    // Mettre à jour la quantité
                    newItems[existingIndex].quantity += item.quantity || 1;
                } else {
                    // Ajouter nouveau (sera complété lors du fetch API)
                    newItems.push({
                        id: item.productId,
                        name: '',
                        price: 0,
                        quantity: item.quantity || 1,
                        image: '',
                        storeId: '',
                        sku: '',
                        attributes: item.attributes || {}
                    });
                }
            });
            
            // Recalculer les totaux
            const totals = calculateCartTotals(newItems);
            
            // Dispatcher l'action setItems
            dispatch(setItems({ 
                items: newItems,
                totalItems: totals.totalItems,
                totalPrice: totals.totalPrice
            }));
            
            logger.info('Basket synced from localStorage', { count: localItems.length });
        }
    } catch (error) {
        logger.error('Error in loadBasketFromStorage thunk', error);
    }
};

/**
 * Synchronise le panier Redux vers localStorage
 */
export const syncBasketToStorage = () => (dispatch, getState) => {
    try {
        const items = getState().basket.items;
        saveToLocalStorage(items);
    } catch (error) {
        logger.error('Error in syncBasketToStorage thunk', error);
    }
};

// ============================================
// EXPORTS
// ============================================

// Exports des actions
export const { 
    addProduct, 
    updateQuantity,
    delProduct, 
    reset, 
    setLoading, 
    setError, 
    clearError,
    setItems
} = basketSlice.actions;

// Exports utilitaires localStorage (pour usage externe)
export { 
    saveToLocalStorage, 
    loadFromLocalStorage, 
    clearLocalCart 
};

// Sélecteurs
export const basketSelectors = {
    selectItems: (state) => state.basket.items,
    selectTotalItems: (state) => state.basket.totalItems,
    selectTotalPrice: (state) => state.basket.totalPrice,
    selectIsLoading: (state) => state.basket.isLoading,
    selectError: (state) => state.basket.error
};

export default basketSlice;
