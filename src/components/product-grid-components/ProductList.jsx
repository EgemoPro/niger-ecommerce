import PropTypes from "prop-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "./ProductCard";
import { useNavigation } from "react-router-dom";
import Loader from "../loader";

const ProductList = ({
  visibleProducts,
  favorites,
  toggleFavorite,
  onOpen,
}) => {
  const { state } = useNavigation();

  return state === "loading" ? (
    <Loader />
  ) :  (
    <ScrollArea className="h-[calc(100vh-125px)] max-md:h-[calc(100vh-200px)] snap-y snap-mandatory overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-2">
        {visibleProducts.map((product) => (
          <div key={product.id} className="snap-start scroll-mt-4 snap-always ">
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
};

ProductList.propTypes = {
  visibleProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  favorites: PropTypes.object.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default ProductList;
