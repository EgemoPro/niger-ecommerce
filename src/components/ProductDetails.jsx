import React, { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

export const sizes = [
  { id: 1, name: "S" },
  { id: 2, name: "M" },
  { id: 3, name: "L" },
  { id: 4, name: "XL" },
  { id: 5, name: "2XL" },
];

const ProductDetails = ({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  colorSelected,
  setColorSelected,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
  const fullDescription = product.description;
  const truncatedDescription = fullDescription.slice(0, Math.floor(fullDescription.length / 4));

  useEffect(() => {
    if (product.colors.length > 0 && !colorSelected) {
      setColorSelected(product.colors[0]);
    }
  }, [product.colors, colorSelected, setColorSelected]);

  return (
    <ScrollArea className="w-full h-[230px] sm:h-[300px] md:h-full mt-8 sm:mt-10 md:mt-0 md:pl-4 p-2 sm:p-4 rounded-lg shadow-sm border bg-white">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-baseline mb-3 sm:mb-4">
          <span className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {'FCFA '}
            {product.price.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
          </span>
          <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-500">
            .{product.price.toString().split('.')[1] || '00'}
          </span>
        </div>
        <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
          <p 
            className="text-xs sm:text-sm text-gray-700 leading-relaxed cursor-pointer"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            {isDescriptionExpanded ? fullDescription : truncatedDescription}
            {!isDescriptionExpanded && (
              <span className="text-blue-600 hover:text-blue-800 font-semibold ml-1">
                ...plus
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Couleur</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3 p-2">
            {product.colors.map((color, index) => (
              <Button
                key={index}
                variant="outline"
                size="icon"
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg border-2 transition-all duration-200 ease-in-out hover:scale-110 ${
                  colorSelected === color ? "ring-2 ring-offset-2 ring-black scale-110" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setColorSelected(color)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Taille</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {sizes.map((size) => (
              <Button
                key={size.id}
                variant={selectedSize.id === size.id ? "default" : "outline"}
                className="w-10 h-10 sm:w-12 sm:h-12 text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out"
                onClick={() => setSelectedSize(size)}
              >
                {size.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Quantité</h3>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ease-in-out"
            >
              <Minus size={14} className="sm:w-4 sm:h-4" />
            </Button>
            <span className="mx-3 sm:mx-4 text-base sm:text-lg font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ease-in-out"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default ProductDetails;