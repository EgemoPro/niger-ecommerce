import PropTypes from "prop-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "./ProductCard";
import { useNavigation } from "react-router-dom";
import Loader from "../loader";
import { useRef, useState, useEffect } from "react";



const ProductList = ({
  visibleProducts,
  favorites,
  toggleFavorite,
  onOpen,
  isDataLoadig
}) => {
  // const { state } = useNavigation();
  const scrollRef = useRef(null);
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        // Vérifie si on est en bas du scroll
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          setIsBottom(true);
        } else {
          setIsBottom(false);
        }
      }
    };

    const scrollElement = scrollRef.current.lastChild;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

    // implementer une fonctionnalité de chargement au scroll
    useEffect(() => {
      if (isBottom) {
        console.log("bottom reached");
      }
    }, [isBottom]);

  return isDataLoadig ? (
    <Loader />
  ) : (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-125px)] max-md:h-[calc(100vh-200px)] snap-y snap-mandatory overflow-y-auto">
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-3 p-2">
        {visibleProducts.map((product, index) =>
          index % 5 != 0 ? (
            <div
              key={product.id}
              className="snap-start scroll-mt-4 snap-always "
            >
              <ProductCard
                product={product}
                isFavorite={favorites[product.id]}
                onToggleFavorite={toggleFavorite}
                onOpen={onOpen}
              />
            </div>
          ) : (
            // augmenter une section qui apparait aleatoirement par modulo 5 pour des spots publicitaire
            <></>
            //  <div key={product.id} className="md:col-span-3 lg:col-span-4 row-span-1 bg-violet-600 p-2 ">
            //  </div>
          )
        )}
      {isBottom && (<div className="h-50 grid col-span-2 md:col-span-3 lg:col-span-4 row-span-1 place-items-center">
        
        <Loader className={`h-8 w-8`} />
        </div>
        )}
      </div>
    </ScrollArea>
  );
};

ProductList.propTypes = {
  visibleProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  favorites: PropTypes.object.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  isDataLoadig: PropTypes.bool.isRequired,
};

export default ProductList;
