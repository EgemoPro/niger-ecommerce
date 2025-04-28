import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { popularShops } from "@/components/PopularShops";
import { PageNavigation } from "@/components/navigation/PageNavigation";
import { ShopBanner } from "@/components/shop/ShopBanner";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopTabs } from "@/components/shop/ShopTabs";
import { ShopAbout } from "@/components/shop/ShopAbout";
import ShopProducts from "./shop-components/Products";
import ShopPhotos from "./shop-components/Photos";
import ShopReviews from "./shop-components/Reviews";
import ShopFAQ from "./shop-components/FAQ";
import ShopChat from "./shop-components/Chat";
import ProductDetail from "./shop-components/ProductDetail";
// import { Shop } from "@/types/shop";

export default function ShopDetails() {
  const { id } = useParams();
  const shop = popularShops.find((s) => s.id === id);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === `/shop/${id}/`) {
      navigate(`/shop/${id}/about`, {replace: true});
    }
  }, [location, navigate, id]);

  if (!shop) {
    return <div>Boutique non trouvée</div>;
  }

  const tabs = [
    { path: "about", label: "À propos" },
    { path: "products", label: "Produits" },
    { path: "photos", label: "Photos" },
    { path: "reviews", label: "Avis" },
    { path: "faq", label: "FAQ" },
  ];

  const currentTab = location.pathname.split("/").pop();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-white to-accent/50">
      <PageNavigation title={shop.name} />

      {/* Ajuste le margin-top pour compenser la hauteur de la navigation */}
      <div className="max-w-[1200px] mx-auto bg-white/80 backdrop-blur-sm shadow-lg mt-[88px]">
        <ShopBanner banner={shop.banner} alt={`Bannière de ${shop.name}`} />
        <ShopHeader id={shop.id} name={shop.name} products={shop.products} />
        <ShopTabs 
          tabs={tabs} 
          shopId={shop.id} 
          currentTab={currentTab || "about"} 
          className={isScrolled ? "shadow-lg" : ""}
        />

        <div className="p-4 md:p-8">
          <Routes>
            <Route path="about" element={
              <ShopAbout 
                description={shop.description} 
                popularProducts={shop.popularProducts} 
              />
            } />
            <Route path="products" element={<ShopProducts />} />
            <Route path="photos" element={<ShopPhotos />} />
            <Route path="reviews" element={<ShopReviews />} />
            <Route path="faq" element={<ShopFAQ />} />
            <Route path="chat" element={<ShopChat />} />
            <Route path="product/:productId" element={<ProductDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
