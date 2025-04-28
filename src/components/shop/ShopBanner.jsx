
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const ShopBanner = ({ banner, alt }) => {
  return (
    <div className="relative group">
      <AspectRatio ratio={3 / 1}>
        <div className="relative w-full h-full bg-secondary/5">
          <img
            src={banner}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300" />
        </div>
      </AspectRatio>
    </div>
  );
};
