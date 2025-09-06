import { Badge } from "../ui/badge";

const ProductPrice = ({ price, originalPrice, discount }) => (
  <div className="flex items-center flex-wrap">
    <span className="font-bold text-sm mr-1">FCFA{price.toFixed(2)}</span>
    {Math.ceil(price / originalPrice) > 0 && (
      <>
        <span className="text-xs text-gray-500 line-through">
          FCFA {originalPrice.toFixed(2)}
        </span>
        <Badge variant="destructive" className="ml-1 text-xs">
          - {Math.ceil((price / originalPrice)*100)}%
        </Badge>
      </>
    )}
  </div>
);

export default ProductPrice;
