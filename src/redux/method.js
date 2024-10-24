

export const handleBacketAction = (type, payload, quantity = 1)=>{
    console.log(payload);
    // payload.quantity = quantity
    switch (type) {
        case 'addProduct':
            return {
                type: 'basket/addProduct',
                payload: {...payload}
            }
        
        case 'delProduct':
            return{
                type: 'basket/delProduct',
                payload: payload
            }
        case 'setQuantity':
            return{
                type: 'basket/setQuantity',
                payload: payload
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