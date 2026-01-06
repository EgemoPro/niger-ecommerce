
import { useParams } from "react-router-dom";
import { popularShops } from "@/components/PopularShops";
import { MessageCircle, Star } from "lucide-react";

const ShopReviewsPage = () => {
  const { id } = useParams();
  const shop = popularShops.find((s) => s.id === id);

  if (!shop) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-primary" />
        Avis clients
      </h2>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-sm p-6 group hover:shadow-md hover:border-primary/20 transition-all duration-300"
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
              <div>
                <div className="h-4 bg-muted rounded-full w-32 mb-2 animate-pulse" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-full animate-pulse" />
              <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopReviewsPage;
