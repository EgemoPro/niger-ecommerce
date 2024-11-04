import { ShoppingCart, Heart } from "lucide-react";
import { useSelector } from "react-redux";
// import { handleBacketAction } from "../redux/method";
// import { addProduct } from "../redux/Slices/backetSlice";
const ActionButtons = ({
  isFavorite,
  toggleFavorite,
  product,
  onAddToCart,
}) => {
  const basket = useSelector((state) => state.basket);
  // const dispatch = useDispatch()

  return (
    <div className="flex flex-col md:flex-row  justify-between md:gap-2">
      <div className="flex md:gap-2 w-full max-md:h-12 justify-end  md:px-4">
        <button
          onClick={toggleFavorite}
          className={`flex items-center justify-center max-middle:w-1/4 px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 max-md:rounded-none ${
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
          className="flex items-center justify-center gap-4 max-middle:w-3/4  w-auto bg-blue-600 text-white px-3 md:px-4 py-2 rounded-md max-md:rounded-none hover:bg-blue-700 text-sm font-medium transition-colors duration-300"
        >
          <span className="max-md:w-1/6 max-md:flex max-md:flex-col max-md:items-center max-md:justify-center">
            <span className="h-3 w-3 p-2 bg-white/20 rounded-full flex justify-center items-center">
              {basket.length}
            </span>
            <ShoppingCart size={18} />
          </span>

          <span
            className="max-md:w-4/6 "
          >
          Ajouter au panier
          </span>
        </button>
      </div>
    </div>
  );
};


export default ActionButtons;
