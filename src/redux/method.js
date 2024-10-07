

export const handleBacketAction = (type, payload)=>{

    switch (type) {
        case 'addProduct':
            return {
                type: 'backet/addProduct',
                payload: {...payload}
            }
        
        case 'delProduct':
            return{
                type: 'backet/delProduct',
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