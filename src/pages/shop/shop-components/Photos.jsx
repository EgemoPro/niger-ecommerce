
import { useParams } from "react-router-dom";
import { popularShops } from "@/components/PopularShops";
import { Image } from "lucide-react";

export default function ShopPhotos() {
  const { id } = useParams();
  const shop = popularShops.find((s) => s.id === id);

  if (!shop) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Image className="w-6 h-6 text-primary" />
        Photos de la boutique
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <div className="w-full h-full bg-secondary/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
