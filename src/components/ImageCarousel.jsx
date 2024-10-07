import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import loader from '../assets/bouncing-squares.svg'
import { useState, useEffect } from "react";

const ImageCarousel = ({
  images,
  currentImageIndex,
  setCurrentImageIndex,
  nextImage,
  prevImage,
  isFullScreen,
}) => {
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const preloadImages = () => {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => setLoadedImages((prev) => [...prev, src]);
      });
    };
    preloadImages();
  }, [images]);

  return (
    <div className="w-full relative overflow-hidden">
      {/* Image principale */}
      <div className="relative w-full md:h-[510px] h-[300px] p-2">
        {images.map((image, index) => (
          <div key={index} className="absolute top-0 left-0 w-full  h-full">
            {loadedImages.includes(image) ? (
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className={`absolute top-0 left-0 w-full rounded-lg object-cover transition-opacity duration-300 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  margin: "auto",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <img src={loader} alt="Loading..." className="w-16 h-16" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Boutons de navigation */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 transition-opacity duration-300 hover:bg-opacity-75"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextImage}
        className="absolute  right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 transition-opacity duration-300 hover:bg-opacity-75"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicateur de pagination */}
      <div className={`absolute left-0 right-0 flex justify-center bottom-4 `}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`mx-1 w-6 h-6 text-xs rounded-full ${
              index === currentImageIndex
                ? "bg-gray-800 text-white"
                : "bg-gray-300/30 text-gray-800"
            } `}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* ScrollArea des miniatures - Apparait seulement en plein écran */}
      {isFullScreen && (
        <div
          className={`absolute p-1 h-24 w-[calc(100%-10px)] md:top-0 top-2 left-0 transition-transform duration-500 ease-in-out ${
            isFullScreen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          }`}
        >
          <ScrollArea className="flex flex-row items-center justify-center h-full  p-0">
            <div className="flex flex-row items-center h-full w-full mt space-x-3 p-1" ref={(ref) => {
              if (ref) {
                const activeThumb = ref.children[currentImageIndex]
                if (activeThumb) {
                  activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                }
              }
            }}>
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg transition-transform ${
                    index === currentImageIndex
                      ? "border-2 border-gray-300 scale-110"
                      : "border border-gray-300/20 opacity-30"
                  }`}
                >
                  {loadedImages.includes(image) ? (
                    <img
                      src={image}
                      alt={`Miniature ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src={loader} alt="Loading..." className="w-8 h-8" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
