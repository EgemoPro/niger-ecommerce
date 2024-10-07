import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "../components/ui/card";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
}) => (
  <div className="w-full  md:pl-4">
    <p className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-800">
      {product.price} FCFA
    </p>

    <p className="text-sm text-gray-600 mb-4 md:mb-6">{product.description}</p>

    <div className="flex md:flex-row flex-col item-center gap-2">
      <div className="md:w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Taille
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {selectedSize.name || "Sélectionner une taille"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2">
            <div className="grid">
              {sizes.map((size) => (
                <Button
                  key={size.id}
                  variant="ghost"
                  className="justify-start w-full hover:bg-slate-400/10"
                  onClick={() => setSelectedSize(size)}
                >
                  {size.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:w-1/2">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Quantité
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          className="w-full border rounded-lg p-2 text-sm"
        />
      </div>
    </div>
    <div className="flex flex-start items-center space-x-2 mt-3 mb-3">
      {product.colors.map((color, index) => (
        <Button
          key={index}
          variant="outline"
          size="icon"
          className={`w-8 h-8 rounded-full mx-1 shadow-lg border ${
            colorSelected === color ? "ring-2 ring-offset-2 ring-black" : ""
          }`}
          style={{ backgroundColor: color }}
          onClick={() => setColorSelected(color)}
        />
      ))}
    </div>
  </div>
);

export default ProductDetails;
