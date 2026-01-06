
import { useParams, useNavigate } from "react-router-dom";
import { popularShops } from "@/components/PopularShops";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from "lucide-react";
import { toast } from "sonner";
// import { Product } from "@/types/shop";
import { useState } from "react";

export default function ProductDetail() {
  const { id, productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const shop = popularShops.find((s) => s.id === id);
  
  if (!shop) return null;
  
  // Find the product in the shop's popular products or generate one if not found
  let product = shop.popularProducts.find((p) => p.id === productId);
  
  if (!product && productId?.startsWith('generated-')) {
    const index = parseInt(productId.replace('generated-', ''));
    product = {
      id: productId,
      name: `Produit ${index + 1}`,
      image: `https://images.unsplash.com/photo-${1500000000 + index * 1000}`,
    };
  }
  
  if (!product) {
    return <div className="p-8 text-center text-foreground">Produit non trouvé</div>;
  }
  
  const handleBack = () => {
    navigate(`/shop/${id}/products`);
  };
  
  const handleAddToCart = () => {
    toast.success(`${quantity} × ${product?.title} ajouté au panier`, {
      description: "Vous pouvez consulter votre panier pour finaliser votre commande.",
      duration: 3000,
    });
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-6 group" 
        onClick={handleBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        Retour aux produits
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-sm overflow-hidden">
          <AspectRatio ratio={1}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <div className="p-4 flex justify-between border-t border-border">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <Star className="w-4 h-4 text-accent fill-accent" />
              <Star className="w-4 h-4 text-accent fill-accent" />
              <Star className="w-4 h-4 text-accent fill-accent" />
              <Star className="w-4 h-4 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">(42 avis)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-primary/5">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/5">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
          
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">
              129.99 €
            </span>
            <span className="ml-3 line-through text-sm text-muted-foreground">149.99 €</span>
            <span className="ml-3 text-sm font-medium bg-accent/20 text-accent px-2 py-1 rounded">-13%</span>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                  <span className="text-sm text-accent">En stock</span>
                </div>
                <div className="text-sm text-muted-foreground">Expédition sous 24h</div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="font-medium mb-2 text-foreground">Description</h3>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
              Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
              rhoncus ut eleifend nibh porttitor.
            </p>
            <ul className="mt-4 list-disc list-inside text-muted-foreground">
              <li>Matériau premium haute qualité</li>
              <li>Design moderne et élégant</li>
              <li>Facile à entretenir</li>
              <li>Disponible en plusieurs coloris</li>
            </ul>
          </div>
          
          <div className="pt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-foreground">Quantité :</span>
              <div className="flex items-center border border-border rounded-md bg-card">
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-9 px-3 hover:bg-primary/5"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </Button>
                <span className="w-8 text-center text-foreground">{quantity}</span>
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-9 px-3 hover:bg-primary/5"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            <Button onClick={handleAddToCart} className="w-full sm:w-auto">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
