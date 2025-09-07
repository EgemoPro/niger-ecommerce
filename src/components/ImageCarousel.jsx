import { Bookmark, BookmarkCheckIcon, ChevronLeft, ChevronRight, Share2Icon, UserCheck2Icon, UserPlus } from "lucide-react";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import loader from '../assets/bouncing-squares.svg'
import { useState, useEffect } from "react";
import ImageActions from "./image-actions";
import Carousel from "./Crousel";

// modifier les boutons pour les icônes

const Buttons = [
  {
    Title: "follow",
    Icon: UserPlus,
    ClickedIcon: UserCheck2Icon 
  },
  {
    Title: "follow",
    Icon: Bookmark,
    ClickedIcon: BookmarkCheckIcon
  }
]


const ImageCarousel = ({
  images,
  currentImageIndex,
  setCurrentImageIndex,
  nextImage,
  prevImage,
  isFullScreen,
  toggleFullScreen,
}) => {
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const preloadImages = () => {
      images.forEach(({ url }) => {
        const img = new Image();
        img.src = url;
        img.onload = () => setLoadedImages((prev) => [...prev, url]);
      });
    };
    preloadImages();
  }, [images]);

  return (
    <div className="w-full relative overflow-hidden ">
      <ImageActions Buttons={Buttons} toggleFullScreen={toggleFullScreen} isFullScreen={isFullScreen} />
      <Carousel
        images={images}
        showThumbnails={isFullScreen}
        autoPlay={true}
      />
    </div>
  );
};

export default ImageCarousel;
