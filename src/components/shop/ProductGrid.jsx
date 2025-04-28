
import { Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

// Export this component as both default and named export
// to ensure compatibility with both import styles
export const ProductGrid = ({ title, products, onViewAll, shopId }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-heading-2 flex items-center gap-2">
          <Store className="w-6 h-6 text-primary" />
          {title}
        </h2>
        {onViewAll && (
          <Button variant="outline" size="sm" className="group" onClick={onViewAll}>
            Voir tout
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index}
            shopId={shopId}
            onClick={() => console.log(`View product: ${product.name}`)}
          />
        ))}
      </div>
    </div>
  );
};

// Also export as default to maintain compatibility
export default ProductGrid;
