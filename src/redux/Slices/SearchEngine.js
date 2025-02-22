import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const initialState = {
  searchTerm: "",
  searchResults: [],
  filters: {
    categories: [], // Permet la sélection de plusieurs catégories
    minPrice: 0,
    maxPrice: Infinity,
    sortBy: "relevance",
  },
  cache: {}, // Cache des résultats pour améliorer la performance
};

export const searchEngineSlice = createSlice({
  name: "searchEngine",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload.trim(); // Suppression des espaces inutiles
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload || [];
    },
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearSearch: () => initialState,
    sortResults: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    cacheResults: (state, action) => {
      const { key, data } = action.payload;
      state.cache[key] = data; // Stockage des résultats pour éviter des calculs inutiles
    },
  },
});

// Selectors
const selectSearchTerm = (state) => state.searchEngine.searchTerm;
const selectSearchResults = (state) => state.searchEngine.searchResults;
const selectFilters = (state) => state.searchEngine.filters;
const selectCache = (state) => state.searchEngine.cache;

const selectFilteredResults = createSelector(
  [selectSearchResults, selectSearchTerm, selectFilters, selectCache],
  (searchResults, searchTerm, filters, cache) => {
    if (!searchTerm && filters.categories.length === 0) return searchResults;

    const lowercasedTerm = searchTerm.toLowerCase();
    const cacheKey = `${lowercasedTerm}-${JSON.stringify(filters)}`;

    // Vérifie si la recherche a déjà été faite (cache)
    if (cache[cacheKey]) return cache[cacheKey];

    // Fonction de tokenisation pour une meilleure recherche
    const tokenize = (text) => text.toLowerCase().split(/\s+/);

    // Filtrage des résultats
    let filteredResults = searchResults.filter((item) => {
      const tokens = tokenize(item.name + " " + item.description);
      const searchTokens = tokenize(lowercasedTerm);
      const matches = searchTokens.every((token) => tokens.includes(token));

      const inPriceRange =
        item.price >= filters.minPrice && item.price <= filters.maxPrice;
      const inCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(item.category);

      return matches && inPriceRange && inCategory;
    });

    // Tri des résultats
    const sortingStrategies = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "name-desc": (a, b) => b.name.localeCompare(a.name),
      relevance: (a, b) => {
        // Pondération : priorité à la correspondance du nom
        const relevanceScore = (item) => {
          let score = 0;
          if (item.name.toLowerCase().includes(lowercasedTerm)) score += 10;
          if (item.description.toLowerCase().includes(lowercasedTerm))
            score += 5;
          return score;
        };
        return relevanceScore(b) - relevanceScore(a);
      },
    };

    const sortFn = sortingStrategies[filters.sortBy] || (() => 0);
    filteredResults = filteredResults.sort(sortFn);

    return filteredResults;
  }
);

export const {
  setSearchTerm,
  setSearchResults,
  updateFilters,
  clearSearch,
  sortResults,
  cacheResults,
} = searchEngineSlice.actions;

export const searchEngineSelectors = {
  selectFilteredResults,
  selectSearchTerm,
  selectSearchResults,
  selectFilters,
  selectCache,
};

export default searchEngineSlice;
