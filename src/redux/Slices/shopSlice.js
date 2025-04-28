
import { createSlice } from '@reduxjs/toolkit';
import { popularShops } from '@/components/PopularShops';

const initialState = {
  shops: popularShops,
  currentShop: null,
  loading: false,
  error: null
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setCurrentShop: (state, action) => {
      state.currentShop = state.shops.find(shop => shop.id === action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setCurrentShop, setLoading, setError } = shopSlice.actions;
export default shopSlice;
