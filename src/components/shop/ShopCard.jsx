import { Store } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// import { Shop } from "@/types/shop";
import { createAnimationDelay } from "@/lib/shop-utils";


export const ShopCard = ({ shop, index }) => {
  return (
    <div
      key={shop.id}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 animate-fade-in relative"
      style={createAnimationDelay(index)}
    >
      <AspectRatio ratio={16 / 9}>
        <div className="relative w-full h-full">
          <img
            src={shop.banner}
            alt={`Bannière de ${shop.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full">
                {shop.popularProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-1/3 h-full p-1"
                  >
                    <div className="relative h-full rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="absolute bottom-2 left-2 text-white text-sm font-medium">
                          {product.name}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </AspectRatio>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary-foreground">
              {shop.name}
            </h3>
            <p className="text-sm text-secondary">{shop.description}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary">
            {shop.products} produits
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary">ID: {shop.id}</span>
            <Link
              to={`/shop/${shop.id}/about`}
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              Voir →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
