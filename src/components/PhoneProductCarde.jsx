import React, { useState, useEffect } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import ImageCarousel from "./ImageCarousel";
import ProductDetails, { sizes } from "./ProductDetails";
import ActionButtons from "./ActionButtons";
import { useDispatch } from "react-redux";
import SharePopover from "./SharePopover";
import { handleBacketAction } from "../redux/method";
import { ScrollArea } from "./ui/scroll-area";


const PhoneProductCard = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [colorSelected, setColorSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

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

  const handleBasket = () => {
    dispatch(handleBacketAction("addProduct", {...product, quantity}));
  };

  useEffect(() => {
    setIsDrawerOpen(true);
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent
        side="bottom"
        className={`flex flex-col bg-white w-full p-3 md:p-4 lg:p-6 transition-all duration-300  ${
          isFullScreen
            ? "h-[calc(100%-20px)]"
            : "h-[95%]"
        } `}
      >
        {/* Header du produit */}
        <div className="flex flew-row justify-between items-center mb-2">
          <div className="flex items-center justify-center gap-4 h-10 w-24">
            <SharePopover />
            <button
              onClick={toggleFullScreen}
              className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <DrawerClose asChild>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setTimeout(onClose, 300);
                }}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <X size={20} />
              </button>
            </DrawerClose>
          </div>
        </div>

        {/* Contenu principal : Carousel et détails produit */}
        <ScrollArea className="w-full max-middle:p-4">
          <div className="flex w-full max-middle:flex-col flex-row justify-between gap-4">

          
          <div className="w-1/2 max-middle:w-full h-full max-middle:h-[calc(50%-100px)]">
            <ImageCarousel
              images={product.images}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              nextImage={nextImage}
              prevImage={prevImage}
              isFullScreen={isFullScreen}
            />
            <h2 className="text-xl md:text-2xl font-semibold uppercase text-gray-800 tracking-tight leading-tight px-1 max-md:text-center">{product.title}</h2>
          </div>
          <div className="w-1/2 md:h-full max-middle:w-full h-1/2 p-1">
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
          </div>
        </ScrollArea>

        {/* Boutons d'action: Favoris, Ajouter au panier, etc. */}
        <div className="w-full">
          <ActionButtons
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            product={product}
            onAddToCart={handleBasket}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PhoneProductCard;
