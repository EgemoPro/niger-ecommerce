import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ArrowLeft,
  Search,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import {
  fetchUserFavorites,
  toggleFavorite,
  favorisSelectors,
  clearFavorisMessage,
} from "../../redux/Slices/favorisSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

const MesFavoris = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const favorites = useSelector(favorisSelectors.selectFavorites);
  const isLoading = useSelector(favorisSelectors.selectIsLoading);
  const error = useSelector(favorisSelectors.selectError);
  const successMessage = useSelector(favorisSelectors.selectSuccessMessage);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  // Load favorites on component mount
  useEffect(() => {
    if (user?.payload?.id) {
      dispatch(fetchUserFavorites(user.payload.id));
    }
  }, [dispatch, user?.payload?.id]);

  // Filter favorites based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFavorites(favorites);
    } else {
      setFilteredFavorites(
        favorites.filter(
          (fav) =>
            fav.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fav.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, favorites]);

  const handleRemoveFavorite = async (productId) => {
    if (!user?.payload?.id) return;
    try {
      await dispatch(
        toggleFavorite(user.payload.id, productId)
      );
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearFavorisMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Mes favoris</h1>
            </div>
            {favorites.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {favorites.length} article{favorites.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher dans vos favoris..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg">
              {successMessage}
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : filteredFavorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {searchTerm
                ? "Aucun favori ne correspond à votre recherche"
                : "Vous n'avez pas encore d'articles favoris"}
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="mt-4"
            >
              Découvrir des produits
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filteredFavorites.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-40 bg-gray-100">
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      title="Retirer des favoris"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-gray-900">
                          {product.price?.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "XOF",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Add to cart logic here
                          console.log("Add to cart:", product.id);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MesFavoris;
