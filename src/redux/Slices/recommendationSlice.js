import { createSlice } from "@reduxjs/toolkit";

// les recommendation sur la base des favories utilisateur

// État initial
const initialState = {
  searchCache: {}, // Historique des recherches avec fréquence
  favoriteProducts: [], // Liste des produits favoris de l'utilisateur
  recommendations: [], // Produits recommandés
};

export const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    addToSearchCache: (state, action) => {
      const { searchTerm, filters } = action.payload;
      const key = `${searchTerm}-${JSON.stringify(filters)}`;
      state.searchCache[key] = (state.searchCache[key] || 0) + 1;
    },
    addToFavorites: (state, action) => {
      const product = action.payload;
      if (!state.favoriteProducts.find((p) => p.id === product.id)) {
        state.favoriteProducts.push(product);
      }
    },
    generateRecommendations: (state, action) => {
      const allProducts = action.payload; // Liste complète des produits en stock

      // Fréquence des recherches
      const searchScores = {};
      Object.keys(state.searchCache).forEach((key) => {
        const [searchTerm] = key.split("-");
        searchScores[searchTerm] =
          (searchScores[searchTerm] || 0) + state.searchCache[key];
      });

      // Calcul de la probabilité d'intérêt pour chaque produit
      let recommendationScores = {};

      allProducts.forEach((product) => {
        let score = 0;

        // Vérification de la pertinence par recherche
        Object.keys(searchScores).forEach((term) => {
          if (
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
          ) {
            score += searchScores[term] * 0.5; // 50% de pondération sur l'historique de recherche
          }
        });

        // Vérification de la pertinence par favoris
        state.favoriteProducts.forEach((fav) => {
          if (fav.category === product.category) {
            score += 3; // Boost pour la même catégorie
          }
          if (fav.brand === product.brand) {
            score += 2; // Boost si même marque
          }
          if (
            fav.price >= product.price * 0.8 &&
            fav.price <= product.price * 1.2
          ) {
            score += 1; // Bonus si la gamme de prix est proche
          }
        });

        // Stocker le score
        if (score > 0) {
          recommendationScores[product.id] = score;
        }
      });

      // Trier les recommandations par score décroissant
      const sortedRecommendations = Object.keys(recommendationScores)
        .map((id) => ({
          ...allProducts.find((p) => p.id === id),
          score: recommendationScores[id],
        }))
        .sort((a, b) => b.score - a.score);

      // Sélectionner les meilleures recommandations avec un taux de 70%
      state.recommendations = sortedRecommendations.slice(
        0,
        Math.ceil(sortedRecommendations.length * 0.7)
      );
    },
  },
});

// Sélecteurs
const selectFavorites = (state) => state.recommendation.favoriteProducts;
const selectSearchCache = (state) => state.recommendation.searchCache;
const selectRecommendations = (state) => state.recommendation.recommendations;

export const { addToSearchCache, addToFavorites, generateRecommendations } =
  recommendationSlice.actions;

export const recommendationSelectors = {
  selectFavorites,
  selectSearchCache,
  selectRecommendations,
};

export default recommendationSlice;
