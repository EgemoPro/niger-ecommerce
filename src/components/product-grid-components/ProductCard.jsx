import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import loader from "../../assets/bouncing-squares.svg";
import ProductRating from "./ProductRating";
import ProductPrice from "./ProductPrice";

const ProductCard = ({ product, isFavorite, onToggleFavorite, onOpen }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="overflow-hidden min-w-[240px]">
  <CardHeader className="p-0">
    <CardTitle className="relative">
      <Button
        variant="ghost"
        className="absolute h-8 w-8 top-4 right-4 z-10 flex items-center justify-between p-1 rounded-full bg-slate-50 hover:scale-110 transition-transform duration-300 ease-in-out transform"
        onClick={() => onToggleFavorite(product.id)}
      >
        <Heart
          className={`h-6 w-6 ${
            isFavorite ? "text-red-500 fill-current" : "text-gray-500"
          } transition-colors duration-300`}
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
        <img src={loader} alt="Loading..." className="w-12 h-12" />
      </div>
    )}
    <img
      src={product.images[0]}
      alt={product.title}
      className={`w-full h-52 object-cover hover:scale-110 transition-transform duration-300 ease-in-out ${
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
