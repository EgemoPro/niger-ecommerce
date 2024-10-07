import { Badge } from "../ui/badge";

const ProductPrice = ({ price, originalPrice, discount }) => (
  <div className="flex items-center flex-wrap">
    <span className="font-bold text-sm mr-1">${price.toFixed(2)}</span>
    <span className="text-xs text-gray-500 line-through">
      ${originalPrice.toFixed(2)}
    </span>
    <Badge variant="destructive" className="ml-1 text-xs">
      {discount}% Off
    </Badge>
  </div>
);

export default ProductPrice;
