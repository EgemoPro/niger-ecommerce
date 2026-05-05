import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  addProduct, 
  updateQuantity, 
  delProduct, 
  reset,
  setError,
  clearError 
} from '../redux/Slices/basketSlice';
import { basketSelectors } from '../redux/Slices/basketSlice';
import { logger } from '../services/logger';

// ============================================
// HOOK PERSONNALISÉ - PANIER
// ============================================

export const useBasket = () => {
  const dispatch = useDispatch();
  
  // Sélecteurs
  const items = useSelector(basketSelectors.selectItems);
  const totalItems = useSelector(basketSelectors.selectTotalItems);
  const totalPrice = useSelector(basketSelectors.selectTotalPrice);
  const isLoading = useSelector(basketSelectors.selectIsLoading);
  const error = useSelector(basketSelectors.selectError);

  // Actions
  const addToCart = useCallback((product) => {
    try {
      if (!product || !product.id) {
        logger.warn('Invalid product for addToCart', { product });
        dispatch(setError('Produit invalide'));
        return false;
      }
      
      dispatch(addProduct(product));
      logger.logAddToCart(product.id, product.quantity || 1);
      return true;
    } catch (err) {
      logger.error('Error in addToCart', err);
      dispatch(setError('Erreur lors de l\'ajout au panier'));
      return false;
    }
  }, [dispatch]);

  const removeFromCart = useCallback((productId) => {
    try {
      if (!productId) {
        logger.warn('Invalid productId for removeFromCart', { productId });
        dispatch(setError('ID produit invalide'));
        return false;
      }
      
      dispatch(delProduct(productId));
      logger.logRemoveFromCart(productId);
      return true;
    } catch (err) {
      logger.error('Error in removeFromCart', err);
      dispatch(setError('Erreur lors de la suppression'));
      return false;
    }
  }, [dispatch]);

  const updateProductQuantity = useCallback((productId, quantity) => {
    try {
      if (!productId || typeof quantity !== 'number') {
        logger.warn('Invalid params for updateProductQuantity', { productId, quantity });
        dispatch(setError('Paramètres invalides'));
        return false;
      }
      
      dispatch(updateQuantity({ id: productId, quantity }));
      logger.debug('Product quantity updated', { productId, quantity });
      return true;
    } catch (err) {
      logger.error('Error in updateProductQuantity', err);
      dispatch(setError('Erreur lors de la mise à jour'));
      return false;
    }
  }, [dispatch]);

  const clearCart = useCallback(() => {
    try {
      dispatch(reset());
      logger.debug('Cart cleared');
      return true;
    } catch (err) {
      logger.error('Error in clearCart', err);
      dispatch(setError('Erreur lors du vidage du panier'));
      return false;
    }
  }, [dispatch]);

  const clearBasketError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getProductInCart = useCallback((productId) => {
    return items.find(item => item.id === productId);
  }, [items]);

  const isProductInCart = useCallback((productId) => {
    return items.some(item => item.id === productId);
  }, [items]);

  return {
    // État
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    
    // Actions
    addToCart,
    removeFromCart,
    updateProductQuantity,
    clearCart,
    clearBasketError,
    
    // Utilitaires
    getProductInCart,
    isProductInCart,
    
    // Propriétés calculées
    isEmpty: items.length === 0,
    itemCount: items.length
  };
};

export default useBasket;
