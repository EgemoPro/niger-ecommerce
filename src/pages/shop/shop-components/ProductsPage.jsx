
import { useParams } from "react-router-dom";
import { popularShops } from "@/components/PopularShops";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";

const ShopProductsPage = () => {
  const { id } = useParams();
  const shop = popularShops.find((s) => s.id === id);

  if (!shop) return null;

  const allProducts = [
    ...shop.popularProducts,
    ...Array.from({ length: 9 }).map((_, index) => ({
      id: `generated-${index}`,
      name: `Produit ${index + 1}`,
      image: `https://images.unsplash.com/photo-${1500000000 + index * 1000}`,
    })),
  ];

  return (
    <div className="animate-fade-in">
      <ProductGrid 
        title="Tous les produits" 
        products={allProducts}
        shopId={id}
      />
      
      {allProducts.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
            >
              <div className="aspect-square relative">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopProductsPage;
