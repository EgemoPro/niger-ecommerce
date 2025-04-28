
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  index,
  price = "129.99 €",
  onClick,
  shopId,
}) => {
  const navigate = useNavigate();

  const handleProductView = () => {
    if (onClick) {
      onClick();
    }
    
    if (shopId) {
      navigate(`/shop/${shopId}/product/${product.id}`);
    }
  };

  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      <AspectRatio ratio={1}>
        <div className="relative w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </AspectRatio>
      <div className="p-4">
        <h3 className="text-body font-medium text-secondary-foreground group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          {price && (
            <span className="text-small font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              {price}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="group/btn"
            onClick={handleProductView}
          >
            Voir
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
