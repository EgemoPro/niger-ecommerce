import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

const initialState = {
  data: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  pagination: {
    currentPage: 1,
    limit: 3,
    hasNextPage: true,
    total: 0,
  },
};

// 🔁 Thunk async avec gestion de la pagination
export const fetchProducts = createAsyncThunk(
  "data/fetch",
  async ({ page = 1, limit = 3 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", {
        params: { page, limit },
      });

      const { success, payload, error } = response.data;
      console.log({ success, payload, error })
      
      if (!success) {
        return rejectWithValue(error || "Une erreur inconnue est survenue.");
      }

      return {
        products: payload.products.map((product) => ({
          id: product._id,
          status: product.available ? "available" : "unavailable",
          ...product
          // price: product.price.toFixed(2), // Formater le prix
        })),
        currentPage: page,
        next: payload.next,
        previous: payload.previous,
        total: payload.total,
        limit,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, currentPage, limit, total, next } = action.payload;

        state.status = "succeeded";
        state.data = products;
        state.pagination.currentPage = currentPage;
        state.pagination.limit = limit;
        state.pagination.total = total;
        state.pagination.hasNextPage = next !== null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setPage } = dataSlice.actions;
export default dataSlice;
