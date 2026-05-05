import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "lucide-react";
import {
  toggleFollowing,
  followingSelectors,
} from "../../redux/Slices/followingSlice";

/**
 * FollowingToggle component
 * Add/remove a shop from user's following list
 * 
 * @param {string} shopId - Shop ID
 * @param {string} userId - User ID
 * @param {boolean} showText - Show text label next to icon
 * @param {string} variant - Button variant ('icon', 'outline', 'solid')
 */
const FollowingToggle = ({
  shopId,
  userId,
  showText = false,
  variant = "icon",
}) => {
  const dispatch = useDispatch();
  const isFollowing = useSelector(
    followingSelectors.selectIsFollowing(shopId)
  );
  const isLoading = useSelector(followingSelectors.selectIsLoading);

  const handleToggle = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!userId) {
      console.warn("User ID is required to toggle following");
      return;
    }

    try {
      await dispatch(toggleFollowing(userId, shopId));
    } catch (err) {
      console.error("Failed to toggle following:", err);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`p-2 rounded transition-colors ${
          isFollowing
            ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isFollowing ? "Arrêter de suivre" : "Suivre cette boutique"}
      >
        <Store className="w-5 h-5" />
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`px-4 py-2 rounded border transition-all ${
          isFollowing
            ? "border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100"
            : "border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isFollowing ? "Suivi" : "Suivre"}
      </button>
    );
  }

  if (variant === "solid") {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`px-4 py-2 rounded font-semibold transition-all ${
          isFollowing
            ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isFollowing ? "Arrêter de suivre" : "Suivre"}
      </button>
    );
  }

  return null;
};

export default FollowingToggle;
