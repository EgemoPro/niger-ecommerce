import React, { useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  ArrowLeftCircleIcon,
  PhoneCall,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSelector } from "react-redux";
import { sizes } from "./ProductDetails";
import { useParams } from "react-router-dom";
import OrderPopup from "./order-express-popup";
import loader from '../assets/bouncing-squares.svg'

const PageProduitSweater = () => {
  const { id } = useParams();
  const product = useSelector((state) =>
    state.data.find((p) => p.id === `#${id}`)
  );
  console.log(product);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [mainImage, setMainImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  const handleAddToCart = () => {
    /*if (selectedSize) {
      console.log(`Added to cart: ${quantity} ${product.title} in size ${selectedSize}`);
      // Here you would typically dispatch an action to add the item to the cart
      } else {
        alert("Please select a size before adding to cart");
    }*/
    setIsOpen(true);
  };

  const handleImageClick = (index) => {
    setMainImage(index);
  };

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = product.images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          const timeoutId = setTimeout(() => {
            reject(new Error(`Image loading timeout: ${src}`));
          }, 10000); // 10 seconds timeout
          img.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to load image: ${src}`));
          };
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error(error);
        setImagesLoaded(false);
        // You can add additional error handling here, such as showing an error message to the user
      }
    };

    loadImages();
  }, [product.images]);

 

  return !imagesLoaded ?  (
    <div className="flex justify-center items-center h-screen">
      <img src={loader} className="h-32 w-32" alt="Loading..." />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto p-4">
      <OrderPopup isOpen={isOpen} onClose={setIsOpen} product={product} />
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] w-full flex flex-col md:flex-row"
      >
        <ResizablePanel defaultSize={50} className="mb-4 md:mb-0">
          <img
            src={product.images[mainImage]}
            alt={product.title}
            className="w-full h-auto object-cover p-1"
          />
        </ResizablePanel>
        <ResizableHandle className="hidden md:block" />
        <ResizablePanel defaultSize={50}>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} - Vue ${index + 1}`}
                className={`w-full h-auto object-cover p-0.5 cursor-pointer ${
                  index === mainImage ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviews} Avis)
            </span>
          </div>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <h2 className="font-bold mb-2">Où Acheter</h2>
        </div>
        <div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="mb-4 sm:mb-0">
                <h2 className="font-bold">Prix</h2>
                {/* <div className="flex flex-wrap gap-2 mt-2">
                  {sizes.slice(1,-1).map((size) => (
                    <button
                      key={size.id}
                      className={`w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-200 ${
                        selectedSize === size.name ? 'bg-gray-300' : ''
                      }`}
                      onClick={() => handleSizeSelect(size.name)}
                    >
                      {size.name}
                    </button>
                  ))}
                </div> */}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center">
              <span className="text-2xl text-start w-full font-bold mb-2 sm:mb-0">
                {product.price} fcfa
              </span>
              {/* <div className="flex items-center">
                <button
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span className="mx-4">{quantity}</span>
                <button
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div> */}
            </div>
            <button
              className="w-1/2 bg-green-500 text-white py-3 rounded-lg flex items-center gap-4 hover:bg-green-600 transition-colors p-4"
              onClick={handleAddToCart}
            >
              <PhoneCall className="h-full" />
              En savoir plus
            </button>
            <Link to={"/product"} className="flex items-center gap-4 mt-4">
              {" "}
              <ArrowLeftCircleIcon /> visiter le site
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) ;
};

export default PageProduitSweater;
