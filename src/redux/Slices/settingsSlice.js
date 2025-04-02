import { createSlice } from "@reduxjs/toolkit"
import api from "../../lib/axios"

const initialState = {
    darkmode: false,
    productPage : {
        headerVisibility : false,
        content : {
            scroll : {
                onscroll : false,
                option : {}
            },

        }
    }
}

const SettingSlice = createSlice({
    name : "settings",
    initialState,
    reducers : {
        setDarkMode: (state, action) =>{

        },
        setProductPage : (state, action) =>{
            state.productPage.content.scroll= action.payload

        },
        // setProduct: (state, action) =>{
        // }
    }

})


export const {setDarkMode, setProductPage} = SettingSlice.actions;

export default SettingSlice