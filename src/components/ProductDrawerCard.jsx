import React, { useState, useEffect, useCallback } from "react";
import { X, Maximize2, Minimize2, Store, LucideShoppingBasket, Bookmark, Share2Icon } from "lucide-react";
import {
  Drawer,
  DrawerTitle,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import ImageCarousel from "./ImageCarousel";
import ProductDetails, { sizes } from "./ProductDetails";
import ActionButtons from "./ActionButtons";
import { useDispatch, useSelector } from "react-redux";
import SharePopover from "./SharePopover";
import { handleBacketAction } from "../redux/method";
import { ScrollArea } from "./ui/scroll-area";
import { toggleFavoriteAsync } from "../redux/Slices/userSlice";
import TabsBar from "./tabs-bar/tabs-bar";
import { Button } from "./ui/button";




const ProductDrawerCard = ({ product, onClose }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [colorSelected, setColorSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const dispatch = useDispatch();
  const { user, isLoadig } = useSelector((state) => state.auth);
  const { favorites, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (Array.isArray(favorites)) {
      const isFav = favorites.some(fav => fav.productId === product.id);
      setIsFavorite(isFav);
    }
  }, [favorites, product.id]);

  const toggleFavorite = useCallback(() => {
    if (user?.payload?.userId) {
      // Mise à jour optimiste de l'UI
      setIsFavorite(!isFavorite);
      // Dispatch de l'action Redux
      dispatch(toggleFavoriteAsync(product.id, user.payload.userId));
    }
  }, [dispatch, product.id, user, isFavorite]);



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
    dispatch(handleBacketAction("addProduct", { ...product, quantity }));
  };

  useEffect(() => {
    setIsDrawerOpen(true);
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };



  return (
    <Drawer open={isDrawerOpen} dismissible={false}>
      <DrawerContent
        side="bottom"
        className={`flex rounded-sm flex-col bg-white w-full p-3 md:p-4 lg:p-6 transition-all duration-300  ${isFullScreen ? "h-[calc(100%-20px)]" : "h-[95%]"
          } `}
      >
        {/* Header du produit */}
        <DrawerTitle className="flex flew-row  justify-end items-center mb-2">
          <div className="flex items-center justify-center gap-4 h-10 w-24">
            <DrawerClose asChild>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setTimeout(onClose, 300);
                }}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 transform -translate-y-7 hover:scale-110 active:scale-95"
              >
                <X size={20} />
              </button>
            </DrawerClose>
          </div>
          {/* Follow Btn */}
        </DrawerTitle>

        {/* Contenu principal : Carousel et détails produit */}
        <ScrollArea className="w-full max-middle:p-4">
          <div className="flex w-full max-middle:flex-col flex-row justify-between gap-4">
            <div className="w-1/2 max-middle:w-full h-full max-middle:h-[calc(50%-100px)]">
              <ImageCarousel
                images={product.images}
                toggleFullScreen={toggleFullScreen}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                nextImage={nextImage}
                prevImage={prevImage}
                isFullScreen={isFullScreen}
              />
              <h2 className="text-xl md:text-2xl font-semibold uppercase text-gray-800 tracking-tight leading-tight px-1 max-md:text-center">
                {product.title}
              </h2>
            </div>
            <div className="w-1/2 md:h-full max-middle:w-full h-1/2 p-1">
              <TabsBar
                tabs={[
                  {
                    value: "details",
                    label: (
                      // <Button className="text-[1.2rem]">
                        
                        <LucideShoppingBasket size={24} />
                        // {/* Details */}
                      // {/* </Button> */}
                    ), content: (
                      <ProductDetails
                        product={product}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        colorSelected={colorSelected}
                        setColorSelected={setColorSelected}
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />
                    )
                  },
                  {
                    value: "store", label: (<>
                      <Store size={24} />
                      {/* <span className="text-[1.2rem]">Boutique</span> */}
                    </>),
                    content: <h1>reviews</h1>
                  },
                ]}
              />

            </div>
          </div>
          {/* espace commentaire */}

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

export default ProductDrawerCard;
