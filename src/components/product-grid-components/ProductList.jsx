import PropTypes from "prop-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "./ProductCard";
// import { useNavigation } from "react-router-dom";
import Loader from "../loader";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProductPage } from "../../redux/Slices/settingsSlice";

const ProductList = ({ visibleProducts, onOpen, isDataLoadig }) => {
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
          setProductPage({
            scroll: isOnscroll,
            option: {
              scrollTop,
              scrollHeight,
              clientHeight,
              isBottom
            },
          })
        );
        if(scrollTop + clientHeight >= scrollHeight - 45)
          setIsBottom(true);
        else setIsBottom(false);
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

  return isDataLoadig ? (
    <Loader />
  ) : (
    <ScrollArea
      ref={scrollRef}
      className="h-[calc(100vh-100px)] max-md:h-[calc(100vh-200px)] snap-y snap-mandatory overflow-y-auto"
    >
      <div className="grid max-mobile:grid-cols-1 grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-3 p-2">
        {visibleProducts.map((product, index) => (
            <div
              key={index}
              className=" col-span-1 row-span-1 snap-start scroll-mt-4 snap-always "
            >
              <ProductCard key={product.id} product={product} onOpen={onOpen} />
            </div>))}
        {isBottom && (
          <div className="h-50 grid col-span-2 md:col-span-3 lg:col-span-4 row-span-1 place-items-center">
            <Loader className={`h-8 w-8`} />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

ProductList.propTypes = {
  visibleProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onOpen: PropTypes.func.isRequired,
  isDataLoadig: PropTypes.bool.isRequired,
};

export default ProductList;
