import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchTerm: "",
    searchResults: [],
    filters: {
        category: "",
        minPrice: 0,
        maxPrice: Infinity,
        sortBy: "relevance"
    }
};

export const searchEngineSlice = createSlice({
    name: "searchEngine",
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSearchResults: (state, action) => {
            if (!action.payload) {
                state.searchResults = [];
                return;
            }
            const searchTerm = action.payload.toLowerCase();
            state.searchResults = action.payload.filter(item => 
                item?.name?.toLowerCase().includes(searchTerm) ||
                item?.description?.toLowerCase().includes(searchTerm)
            );
        },
        updateFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload
            };
        },
        clearSearch: (state) => {
            return initialState;
        },
        sortResults: (state, action) => {
            const sortingStrategies = {
                'price-asc': (a, b) => a.price - b.price,
                'price-desc': (a, b) => b.price - a.price,
                'name-asc': (a, b) => a.name.localeCompare(b.name),
                'name-desc': (a, b) => b.name.localeCompare(a.name)
            };
            
            const sortFn = sortingStrategies[action.payload];
            if (sortFn) {
                state.searchResults.sort(sortFn);
            }
        }
    }
});