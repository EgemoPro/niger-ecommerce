import PropTypes from "prop-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "./ProductCard";
import Loader from "../loader";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { 
  updateScrollMetrics, 
  setIsScrolling as setIsScrollingAction, 
  setIsBottom as setIsBottomAction,
} from "../../redux/Slices/settingsSlice";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductList = ({ visibleProducts, onOpen, isDataLoadig, error, onRetry }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);


  const [isBottom, setIsBottom] = useState(false);
  const [isOnscroll, setIsOnScroll] = useState(false);


  useEffect(() => {

    const handleScroll = (e) => {
      const currentRef = e.target;

      if (currentRef) {
        const { scrollTop, scrollHeight, clientHeight } = currentRef;
        dispatch(
          updateScrollMetrics({
              scrollTop,
              scrollHeight,
              clientHeight,
              isBottom
          })
        );
        if (scrollTop + clientHeight >= scrollHeight - 45){
          setIsBottom(true);
          dispatch(setIsBottomAction(true));
        }else{
          setIsBottom(false);
          dispatch(setIsBottomAction(false));
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
  }, [dispatch, isBottom]);

  return isDataLoadig ? (
    <Loader />
  ) : error ? (
    <ScrollArea
      ref={scrollRef}
      className="h-[calc(100vh-100px)] max-md:h-[calc(100vh-200px)]"
    >
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Une erreur est survenue
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message || error || "Impossible de charger les produits"}
          </p>
          <Button 
            onClick={onRetry}
            className="flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
        </div>
      </div>
    </ScrollArea>
  ) : (
    <ScrollArea
      ref={scrollRef}
      className="h-[calc(100vh-100px)] max-md:h-[calc(100vh-200px)] snap-y snap-mandatory overflow-y-auto"
    >
      <div className="grid max-mobile:grid-cols-1 grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-3 p-2">
        {visibleProducts.map((product, index) => (
          <div
            key={index}
            className="col-span-1 row-span-1 snap-start scroll-mt-4 snap-always "
          >
            <ProductCard key={product.id} product={product} onOpen={onOpen} />
          </div>))}
      </div>
      <div className="h-50 w-full flex items-center justify-center p-3">
        {isBottom && (
          <Loader className={`h-8 w-8`} />
        )}
      </div>
    </ScrollArea>
  );
};

ProductList.propTypes = {
  visibleProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onOpen: PropTypes.func.isRequired,
  isDataLoadig: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onRetry: PropTypes.func,
};

export default ProductList;
