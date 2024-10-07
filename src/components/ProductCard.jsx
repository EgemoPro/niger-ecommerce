import React, { useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import ProductDetails,{sizes} from "./ProductDetails";
import ActionButtons from "./ActionButtons";
import { useDispatch } from "react-redux";
import SharePopover from "./SharePopover";
// import { addProduct } from "../redux/Slices/backetSlice";
import { handleBacketAction } from "../redux/method";


const ProductCard = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [colorSelected, setColorSelected] = useState("");
  const dispatch = useDispatch()

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  const handleAddToCart = () => {
    dispatch(handleBacketAction('addProduct',product));
    // Implement add to cart functionality here
    // console.log("Adding to cart:", { product, selectedSize, quantity });
    console.log(product);
  };

  React.useEffect(() => {
    setIsOpen(true);
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex justify-center items-center p-2 md:p-4 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-3 md:p-4 lg:p-6 rounded-lg w-full ${
          isFullScreen
            ? "max-w-[90vw] h-[90vh]"
            : "max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh]"
        } overflow-y-auto transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex flew-row justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold">{product.title}</h2>
          <div className="flex items-center justify-center gap-4 h-10 w-24">
            <SharePopover/>
            <button
              onClick={toggleFullScreen}
              className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row ">
          <ImageCarousel
            images={product.images}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            nextImage={nextImage}
            prevImage={prevImage}
            isFullScreen={isFullScreen}
          />
          <ProductDetails
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            colorSelected={colorSelected}
            setColorSelected={setColorSelected}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>

        <ActionButtons
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          product={product}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ProductCard;
