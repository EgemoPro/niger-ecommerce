

export const handleBacketAction = (type, payload)=>{
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