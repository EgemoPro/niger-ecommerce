

/**
 * Transforme les données du produit API vers le format du panier
 * @param {Object} product - Produit depuis l'API
 * @param {Object} attributes - Attributs sélectionnés (color, size)
 * @returns {Object} Produit au format basket
 */
const transformProductForBasket = (product, attributes = {}) => {
  return {
    // ID (API: _id → basket: id)
    id: product._id || product.id,
    // Nom (API: title → basket: name)
    name: product.title || product.name,
    // Prix
    price: product.price,
    // Image principale
    image: product.images?.[0]?.url || product.image || '',
    // Description
    description: product.description || '',
    // Catégorie
    category: product.category || '',
    // Boutique (pour grouper les commandes)
    storeId: product.storeId || '',
    // SKU
    sku: product.sku || '',
    // Stock (pour validation)
    stock: product.stock || 0,
    // Disponible
    available: product.available !== false,
    // Attributs (color, size) pour distinguer les variants
    attributes: attributes
  };
};

export const handleBacketAction = (type, payload, attributes = {}) =>{
    console.log("handleBacketAction payload:", payload);
    console.log("attributes:", attributes);
    
    switch (type) {
        case 'addProduct':
            // Transformer les données du produit API vers le format basket
            const transformed = transformProductForBasket(payload, attributes);
            console.log("Transformed product:", transformed);
            
            return {
                type: 'basket/addProduct',
                payload: {
                    ...transformed,
                    quantity: payload.quantity || 1
                }
            }
        
        case 'delProduct':
            return{
                type: 'basket/delProduct',
                payload: payload._id || payload.id || payload
            }
        case 'reset':
            return{
                type: 'basket/reset'
            }
        default:
            throw new Error("Backet Slice Probleme")
    }
}

export const handleFavorisAction = (type, payload)=>{

    switch (type) {
        case 'addFavoris':
            return {
                type: 'favoris/addFavoris',
                payload: payload
            }
        
        case 'delFavoris':
            return{
                type: 'favoris/delFavoris',
                payload: payload
            }
    
        default:
            throw new Error("Favoris Slice Probleme")
    }
}