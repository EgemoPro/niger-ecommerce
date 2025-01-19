import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import OrderPopup from "../../components/order-express-popup";
import loader from "../../assets/bouncing-squares.svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Star,
  ArrowLeftCircleIcon,
  PhoneCall,
  ShoppingBag,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
// import { sizes } from "./ProductDetails";

const ProductSweaterPage = () => {
  const { id } = useParams();
  const product = useSelector((state) =>
    state.data.data.find((p) => p.id === `#${id}`)
  );
  // console.log(product);

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

  return !imagesLoaded ? (
    <div className="flex justify-center items-center h-screen">
      <img src={loader} className="h-32 w-32" alt="Loading..." />
    </div>
  ) : (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <OrderPopup isOpen={isOpen} onClose={setIsOpen} product={product} />
      <ResizablePanelGroup
        direction="horizontal"
        className="h-auto md:max-h-[500px] space-x-2 w-full flex flex-col md:flex-row shadow-sm rounded-md overflow-hidden p-4 bg-gray-50"
      >
        <ResizablePanel defaultSize={40} minSize={40}  maxSize={55} className="mb-4 md:mb-0">
          <img
            src={product.images[mainImage]}
            alt={product.title}
            className="w-full h-full object-cover rounded-lg shadow-sm transition-transform hover:scale-105"
          />
        </ResizablePanel>
        <ResizableHandle className="border-l-2 border-black/10 hover:border-black/50 rounded-full" />
        <ResizablePanel defaultSize={30} minSize={20} className="ml-2">
          <div className="grid grid-cols-3 space-x-3">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} - Vue ${index + 1}`}
                className={`w-full h-auto object-cover rounded-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
                  index === mainImage
                    ? "ring-4 ring-blue-50"
                    : "hover:ring-2 ring-blue-300"
                }`}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="space-y-2 md:col-span-2">
            <h1 className="text-3xl text-justify uppercase font-Barlow font-bold text-gray-900 tracking-tight">
              {product.title}
            </h1>
          <ScrollArea className="w-full h-full " >
            <div className="flex items-center space-x-4 mb-3 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-base text-gray-600 font-medium font-Barlow">
                {product.rating} {product.reviews} Avis
              </span>
            </div>
            <p className="text-gray-700 lowercase tracking-tigh font-medium text-md text-justify font-OpenSans leading-relaxed md:pr-5">
              {product.description}
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-10">Où Acheter</h2>
          </ScrollArea>
        </div>

        {/* partie achat */}
        <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 md:col-span-1">
          {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="md:mb-4">
              <h2 className="text-xl font-bold text-gray-900">Prix</h2>
            </div>
          </div> */}
          <div className="h-1/3 w-full flex items-center justify-center mb-4">
            <span className="text-4xl text-center uppercase font-bold text-gray-900/90 mb-4 sm:mb-0 tracking-tight">
              {product.price} fcfa
            </span>
          </div>
          <Button
            className="w-full h-10 bg-blue-500 text-white rounded-xl mb-2 flex items-center justify-start gap-4 font-semibold hover:bg-blue-600 transition-all duration-300 py-4 px-6 shadow-sm hover:shadow-md"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-6 w-6" />
            Acheter maintenant
          </Button>
          <Button
            className="w-full h-10 bg-green-500 text-white rounded-xl flex items-center justify-start gap-4 font-semibold hover:bg-green-600 transition-all duration-300 py-4 px-6 shadow-sm hover:shadow-md"
            onClick={handleAddToCart}
          >
            <PhoneCall className="h-6 w-6" />
            En savoir plus
          </Button>
          <Link
            to={"/product"}
            className="flex items-center gap-4 mt-6 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeftCircleIcon className="h-6 w-6" />
            <span className="font-medium">Visiter le site</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductSweaterPage;
