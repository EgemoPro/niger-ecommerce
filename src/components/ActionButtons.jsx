import { ShoppingCart, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { BasketBtn } from "./bascket-btn";
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
    <div className="md:absolute md:right-0 md:bottom-2 md:p-2 flex flex-col md:flex-row  justify-between md:gap-2">
      <div className="flex md:gap-2 w-full max-md:h-12 justify-end  md:px-4">
        <button
          onClick={toggleFavorite}
          className={`flex items-center justify-center gap-2 max-middle:w-1/4 px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 max-md:rounded-none ${
            isFavorite
              ? "bg-red-100 text-red-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <span className="w-1/3 flex items-center justify-center">
            <Heart
              size={18}
              className={`block min-w-8 transition-transform duration-300 ${
                isFavorite ? "fill-current transform scale-110" : ""
              }`}
            />
          </span>
          <span className="w-2/3 flex  items-start">Favoris</span>
        </button>
        <BasketBtn basketCount={basket.length} onAddToCart={onAddToCart} />
      </div>
    </div>
  );
};

export default ActionButtons;
