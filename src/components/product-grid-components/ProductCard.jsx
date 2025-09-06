import React, { useCallback, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cross, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "../../assets/bouncing-squares.svg";
import RenderStar from "../renderStar"
import ProductPrice from "./ProductPrice";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavoriteAsync } from "../../redux/Slices/userSlice";

const ProductCard = ({ product, onOpen }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(false);
  
  const dispatch = useDispatch();
  const { user, isLoadig } = useSelector((state) => state.auth);
  const { favorites, isLoading } = useSelector((state) => state.user);

  console.log(product.images[0].url);

  // Synchroniser l'état local avec Redux
  useEffect(() => {
    if (Array.isArray(favorites)) {
      const isFav = favorites.some(fav => fav.productId === product.id);
      setLocalIsFavorite(isFav);
    }
  }, [favorites, product.id]);

  // Fonction pour basculer le statut de favori
  const handleToggleFavorite = useCallback(() => {
    if (user?.payload?.userId) {
      // Mise à jour optimiste de l'UI
      setLocalIsFavorite(!localIsFavorite);
      // Dispatch de l'action Redux
      dispatch(toggleFavoriteAsync(product.id, user.payload.userId));
    }
  }, [dispatch, product.id, user, localIsFavorite]);
  
  return (
    <Card className="overflow-hidden md:min-w-[280px] min-h-[300px] ">
      <CardHeader className="p-0 relative">
        <CardTitle className="absolute z-10 right-4 top-3 gap-2 flex flex-col items-center justify-between">
          <Button
            variant="ghost"
            disabled={user == null || isLoading}
            className=" h-8 w-8 flex items-center justify-between p-1 rounded-full bg-slate-50 hover:scale-110 transition-transform duration-300 ease-in-out transform"
            onClick={handleToggleFavorite}
          >
            <Heart
              className={`h-6 w-6 ${
                localIsFavorite ? "text-red-500 fill-current" : "text-gray-500"
              } ${isLoading ? "opacity-50" : ""} transition-colors duration-300`}
            />
          </Button>

          <Button
            variant="ghost"
            disabled={user == null || isLoading}
            className="h-8 w-8 flex items-center justify-between p-1 rounded-full bg-slate-50 hover:scale-110 transition-transform duration-300 ease-in-out transform"
            onClick={handleToggleFavorite}
          >
            <Cross
              className={`h-6 w-6 ${
                localIsFavorite ? "text-red-500 fill-current" : "text-gray-500"
              } ${isLoading ? "opacity-50" : ""} transition-colors duration-300`}
            />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent
        className="p-0 relative cursor-pointer"
        onClick={() => onOpen(product)}
      >
        {!imageLoaded && (
          <div className="w-full h-52 flex items-center justify-center">
            <img src={Loader} alt="Loading..." className="w-12 h-12" />
          </div>
        )}
        <img
          src={product.images[0].url}
          alt={product.images[0].alt || "Product Image"}
          className={`w-full h-52 object-cover object-left-top scale-100 hover:scale-110 transition-transform duration-300 ease-in-out ${
            imageLoaded ? "" : "hidden"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-semibold text-lg mb-2 truncate w-full">
          {product.title}
        </h3>
        <span className="flex py-2 gap-1">{ RenderStar(product.rating)} ({product.reviews}) </span>
        <ProductPrice
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
        />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;