
import { Store, Users, Share2, MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ShopHeader = ({ id, name, products }) => {
  return (
    <div className="px-4 md:px-8 pb-4 border-b backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between -mt-8 md:-mt-16 relative z-10 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
          <div className="bg-white p-1 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-primary/10 to-purple-100 rounded-lg flex items-center justify-center group">
              <Store className="w-16 md:w-20 h-16 md:h-20 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="mb-4 text-center md:text-left">
            <h1 className="text-display-2 font-bold text-secondary-foreground mb-2">
              {name}
            </h1>
            <p className="text-body-large text-secondary">@{id}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="text-small bg-white/80 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                {products} produits
              </span>
              <span className="text-small bg-white/80 backdrop-blur-sm shadow-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                2.5k abonnés
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-4 md:mt-0">
          <Button size="lg" variant="default" className="group hover:shadow-lg transition-all duration-300">
            <Heart className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
            Suivre
          </Button>
          <Link to={`/shop/${id}/chat`}>
            <Button size="lg" variant="secondary" className="group hover:shadow-lg transition-all duration-300">
              <MessageCircle className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
              Contacter
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="hover:shadow-lg transition-all duration-300">
            <Share2 className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          </Button>
        </div>
      </div>
    </div>
  );
};
