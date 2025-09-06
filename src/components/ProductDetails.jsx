import React, { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Separator } from "../components/ui/separator";
import RenderStars from "./renderStar";

// import { useDispatch } from "react-redux";
// import { handleBacketAction } from "../redux/method";
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
  colorSelected,
  setColorSelected,
  quantity,
  setQuantity,
}) => {
  // const dispatch = useDispatch();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const fullDescription = product.description;
  const truncatedDescription = fullDescription.slice(
    0,
    Math.floor(fullDescription.length / 4)
  );

  useEffect(() => {
    if (product.colors.length > 0 && !colorSelected) {
      setColorSelected(product.colors[0]);
    }
  }, [product.colors, colorSelected, setColorSelected]);



  const handleReduceQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
    // dispatch(handleBacketAction("setQuantity", {quantity,id: product.id}));
  };

  const handleAddQuantity = () => {
    setQuantity(quantity + 1);
    //  dispatch(handleBacketAction("setQuantity", {quantity,id: product.id}));
  };

  return (
    <div className="bg-[#f9f9f9]/95 h-auto  md:h-full w-full  md:pl-4 p-2 rounded-lg shadow-sm  sm:mt-0  sm:p-4">
      <div className="">
        <div className="flex items-baseline mb-3 sm:mb-4">
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            {"FCFA "}
            {product.price
              .toString()
              .split(".")[0]
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
          </span>
          <span className="text-sm font-semibold text-gray-500 relative -top-2 left-1">
            .{product.price.toString().split(".")[1] || "00"}
          </span>
        </div>
        {/* les etoiles des produits */}
        <div className="flex items-center w-auto pb-2">
          <div className="flex items-center gap-2 ">
            {RenderStars(product.rating)} ({product.rating})
          </div>
        </div>
        <div className="bg-gray-100 p-3 sm:p-4 rounded-lg mt-2 mb-8">
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
      <Separator/>
      <div className="space-y-4 sm:space-y-6">
        {/* couleurs */}
        {product.colors.length > 0 && (
          <>
            <div className="">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Couleur
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 p-2">
                {product.colors.map((color, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg border-2 transition-all duration-200 ease-in-out hover:scale-110 ${
                      colorSelected === color
                        ? "ring-2 ring-offset-2 ring-black scale-110"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setColorSelected(color)}
                  />
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* taille */}
        {product.sizes.length > 0 && (
          <>
            <div
              className="p-2 mt-2 space-y-3"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm</h3>:mb-3">
                Taille
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={
                      selectedSize.id === size.id ? "default" : "outline"
                    }
                    className="min-w-12 h-10  sm:h-12 text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out p-1"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}
        {/* quantité */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
            Quantité
          </h3>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReduceQuantity}
              className="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ease-in-out"
            >
              <Minus size={14} className="sm:w-4 sm:h-4" />
            </Button>
            <span className="mx-3 sm:mx-4 text-base sm:text-lg font-medium">
              {String(quantity).padStart(2, "0")}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddQuantity}
              className="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ease-in-out"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </div>
  );
};

export default ProductDetails;
