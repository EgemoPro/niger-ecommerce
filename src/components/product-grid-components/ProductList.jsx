import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "./ProductCard";

const ProductList = ({
  visibleProducts,
  favorites,
  toggleFavorite,
  onOpen,
}) => (
  <ScrollArea
    className="h-[calc(100vh-125px)] max-md:h-[calc(100vh-210px)] snap-y snap-mandatory p-4 overflow-y-auto"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {visibleProducts.map((product) => (
        <div key={product.id} className="snap-start scroll-mt-4 snap-always">
          <ProductCard
            product={product}
            isFavorite={favorites[product.id]}
            onToggleFavorite={toggleFavorite}
            onOpen={onOpen}
          />
        </div>
      ))}
    </div>
  </ScrollArea>
);

export default ProductList;