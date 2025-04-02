import React, { useCallback, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "../../assets/bouncing-squares.svg";
import ProductRating from "./ProductRating";
import ProductPrice from "./ProductPrice";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavoriteAsync } from "../../redux/Slices/userSlice";

const ProductCard = ({ product, onOpen }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(false);
  
  const dispatch = useDispatch();
  const { user, isLoadig } = useSelector((state) => state.auth);
  const { favorites, isLoading } = useSelector((state) => state.user);

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
    <Card className="overflow-hidden min-w-[250px] min-h-[300px] ">
      <CardHeader className="p-0">
        <CardTitle className="relative">
          <Button
            variant="ghost"
            disabled={user == null || isLoading}
            className="absolute h-8 w-8 top-4 right-4 z-10 flex items-center justify-between p-1 rounded-full bg-slate-50 hover:scale-110 transition-transform duration-300 ease-in-out transform"
            onClick={handleToggleFavorite}
          >
            <Heart
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
          src={product.images[0]}
          alt={product.title}
          className={`w-full h-52 object-cover object-left-top scale-90 hover:scale-100 transition-transform duration-300 ease-in-out ${
            imageLoaded ? "" : "hidden"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-semibold text-lg mb-2 truncate w-full">
          {product.title}
        </h3>
        <ProductRating rating={product.rating} reviews={product.reviews} />
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