
import { Store, MapPin, Globe, Clock, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./ProductGrid";


export const ShopAbout = ({ description, popularProducts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
      <div className="md:col-span-1 space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 p-6">
          <h2 className="text-2xl mb-6 flex items-center gap-2 font-semibold text-foreground">
            <Store className="w-5 h-5 text-primary" />
            À propos
          </h2>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            <Separator className="bg-border" />
            <div className="space-y-4">
              {[
                { icon: MapPin, text: "15 Rue du Commerce, Paris, France" },
                { icon: Globe, text: "www.boutique.com", isLink: true },
                { icon: Clock, text: "Ouvert • 9h00 - 19h00" },
                { icon: Phone, text: "+33 1 23 45 67 89" },
                { icon: Mail, text: "contact@boutique.com" },
              ].map(({ icon: Icon, text, isLink }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 group hover:text-primary transition-colors duration-300 text-foreground"
                >
                  <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                  {isLink ? (
                    <a href="#" className="hover:underline text-muted-foreground hover:text-foreground">{text}</a>
                  ) : (
                    <span className="text-muted-foreground">{text}</span>
                  )}
                </div>
              ))}
            </div>
            <Separator className="bg-border" />
            <div className="flex gap-3">
              {[Facebook, Instagram].map((Icon, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary/5 hover:border-primary/20 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5 text-primary hover:scale-110 transition-transform duration-300" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <ProductGrid 
          title="Produits populaires" 
          products={popularProducts} 
          onViewAll={() => console.log("View all products")} 
        />
      </div>
    </div>
  );
};
