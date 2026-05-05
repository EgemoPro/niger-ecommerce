import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  ArrowLeft,
  Search,
  Star,
  MessageCircle,
} from "lucide-react";
import {
  fetchUserFollowing,
  toggleFollowing,
  followingSelectors,
  clearFollowingMessage,
} from "../../redux/Slices/followingSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

const BoutiquesSuivies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const following = useSelector(followingSelectors.selectFollowing);
  const isLoading = useSelector(followingSelectors.selectIsLoading);
  const error = useSelector(followingSelectors.selectError);
  const successMessage = useSelector(followingSelectors.selectSuccessMessage);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);

  // Load following shops on component mount
  useEffect(() => {
    if (user?.payload?.id) {
      dispatch(fetchUserFollowing(user.payload.id));
    }
  }, [dispatch, user?.payload?.id]);

  // Filter shops based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredShops(following);
    } else {
      setFilteredShops(
        following.filter(
          (shop) =>
            shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, following]);

  const handleUnfollow = async (shopId) => {
    if (!user?.payload?.id) return;
    try {
      await dispatch(toggleFollowing(user.payload.id, shopId));
    } catch (err) {
      console.error("Failed to unfollow shop:", err);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearFollowingMessage());
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
              <Store className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Boutiques suivies
              </h1>
            </div>
            {following.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {following.length} boutique{following.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher une boutique..."
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
        ) : filteredShops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <Store className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {searchTerm
                ? "Aucune boutique ne correspond à votre recherche"
                : "Vous ne suivez pas encore de boutiques"}
            </p>
            <Button
              onClick={() => navigate("/shops")}
              className="mt-4"
            >
              Découvrir des boutiques
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredShops.map((shop) => (
                <motion.div
                  key={shop.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Shop Banner */}
                  <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
                    {shop.banner && (
                      <img
                        src={shop.banner}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Shop Info */}
                  <div className="p-4">
                    {/* Avatar and Name */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="w-12 h-12 -mt-8 border-4 border-white">
                          <AvatarImage
                            src={shop.logo}
                            alt={shop.name}
                          />
                          <AvatarFallback>
                            {shop.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {shop.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {shop.productsCount || 0} produits
                          </p>
                        </div>
                      </div>

                      {/* Unfollow Button */}
                      <button
                        onClick={() => handleUnfollow(shop.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Arrêter de suivre"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {shop.description}
                    </p>

                    {/* Rating */}
                    {shop.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {shop.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({shop.reviewCount || 0} avis)
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/shops/${shop.id}`)}
                      >
                        Visiter
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() =>
                          navigate(`/chat?vendor=${shop.id}`)
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
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

export default BoutiquesSuivies;
