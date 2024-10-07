import { ShoppingCart, Heart, Star } from "lucide-react";
import {  useSelector } from "react-redux";
// import { handleBacketAction } from "../redux/method";
// import { addProduct } from "../redux/Slices/backetSlice";
const ActionButtons = ({
  isFavorite,
  toggleFavorite,
  product,
  onAddToCart,
}) => {
  const backet = useSelector(state => state.backet);
  // const dispatch = useDispatch()
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="text-yellow-400" fill="currentColor" />
        );
      } else if (i === fullStars && partialStar > 0) {
        const percentage = partialStar * 100;
        stars.push(
          <div key={i} className="relative inline-block">
            <Star className="text-yellow-400" />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${percentage}%` }}
            >
              <Star className="text-yellow-400" fill="currentColor" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-2">
      <div className="flex items-center w-auto ">
        <div className="flex items-center gap-2 ">
          {renderStars(product.rating)}  ({product.rating})
        </div>
      </div>
      <div className="flex gap-2 w-full md:w-1/2 md:justify-end">
        <button
          onClick={toggleFavorite}
          className={`flex items-center justify-center px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
            isFavorite
              ? "bg-red-100 text-red-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <Heart
            size={18}
            className={`mr-2 transition-transform duration-300 ${
              isFavorite ? "fill-current transform scale-110" : ""
            }`}
          />
          Favoris
        </button>
        <button
          onClick={onAddToCart}
          className="flex items-center justify-center gap-4 w-auto bg-blue-600 text-white px-3 md:px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors duration-300"
        >
          <span className="h-6 w-6 p-2 bg-white/20 rounded-full flex justify-center items-center" >{backet.length}</span>
          <ShoppingCart size={18} />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
