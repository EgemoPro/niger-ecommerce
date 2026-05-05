import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import {
  toggleFavorite,
  favorisSelectors,
} from "../../redux/Slices/favorisSlice";

/**
 * FavoriteToggle component
 * Add/remove a product from user's favorites
 * 
 * @param {string} productId - Product ID
 * @param {string} userId - User ID
 * @param {boolean} showText - Show text label next to icon
 * @param {string} size - Size of the button (sm, md, lg)
 */
const FavoriteToggle = ({
  productId,
  userId,
  showText = false,
  size = "md",
}) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector(
    favorisSelectors.selectIsFavorite(productId)
  );
  const isLoading = useSelector(favorisSelectors.selectIsLoading);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      console.warn("User ID is required to toggle favorite");
      return;
    }

    try {
      await dispatch(toggleFavorite(userId, productId));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 p-2 rounded transition-colors ${
        isFavorite
          ? "text-red-500 hover:text-red-600 bg-red-50"
          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        className={`${sizeClasses[size]} ${
          isFavorite ? "fill-current" : ""
        }`}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isFavorite ? "Aimé" : "Aimer"}
        </span>
      )}
    </button>
  );
};

export default FavoriteToggle;
