import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  currentProduct: null,
  categories: [],
  filteredProducts: [],
  searchQuery: '',
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    inStock: false
  },
  pagination: {
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 12
  },
  loading: false,
  error: null
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    resetFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 1000],
        rating: 0,
        inStock: false
      };
      state.searchQuery = '';
      state.filteredProducts = state.products;
    },
    
    applyFilters: (state) => {
      let filtered = [...state.products];
      
      // Recherche par texte
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        );
      }
      
      // Filtre par catégorie
      if (state.filters.category) {
        filtered = filtered.filter(product => product.category === state.filters.category);
      }
      
      // Filtre par prix
      filtered = filtered.filter(product => 
        product.price >= state.filters.priceRange[0] && 
        product.price <= state.filters.priceRange[1]
      );
      
      // Filtre par note
      if (state.filters.rating > 0) {
        filtered = filtered.filter(product => product.rating >= state.filters.rating);
      }
      
      // Filtre par stock
      if (state.filters.inStock) {
        filtered = filtered.filter(product => product.stock > 0);
      }
      
      state.filteredProducts = filtered;
    },
    
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setProducts, 
  setCurrentProduct,
  setCategories,
  setSearchQuery,
  setFilters,
  resetFilters,
  applyFilters,
  setPagination,
  setLoading, 
  setError,
  clearError
} = productSlice.actions;

// Sélecteurs
export const productSelectors = {
  selectProducts: (state) => state.product.products,
  selectFilteredProducts: (state) => state.product.filteredProducts,
  selectCurrentProduct: (state) => state.product.currentProduct,
  selectCategories: (state) => state.product.categories,
  selectSearchQuery: (state) => state.product.searchQuery,
  selectFilters: (state) => state.product.filters,
  selectPagination: (state) => state.product.pagination,
  selectIsLoading: (state) => state.product.loading,
  selectError: (state) => state.product.error
};

export default productSlice;
