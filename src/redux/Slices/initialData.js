import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { initialState } from "../initialState";

const fetchInitialData = createAsyncThunk("data/fetchInitialData", async () => {
  try {
    const response = await axios.get(
      `https://fakestoreapi.com/products?limit=${initialState.length}`
    );
    const data = response.data;
    for (let i = 0; i < data.length; i++) {
      initialState[i].title = data[i].title;
      initialState[i].originalPrice =
        data[i].price <= initialState[i].originalPrice
          ? data[i].price
          : initialState[i].originalPrice;
      initialState[i].images = [data[i].image];
      initialState[i].description = data[i].description;
      initialState[i].category = data[i].category;
    }
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }
  return initialState;
});

// faire cette requete avec axios
// const initialData  = () => {}

// console.log(await initialUpdatedState(initialState.length));

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    setQuantity: function (state, action) {
      state.forEach((product) =>
        product.id == action.payload.id
          ? (product.quantity = action.payload.quantity)
          : product
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchInitialData.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    });
    builder.addCase(fetchInitialData.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});


export { dataSlice, fetchInitialData };
