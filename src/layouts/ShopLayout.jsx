
import { Outlet } from "react-router-dom";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopBanner } from "@/components/shop/ShopBanner";
import { ShopTabs } from "@/components/shop/ShopTabs";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentShop } from '../redux/Slices/shopSlice';

const ShopLayout = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const { currentShop } = useSelector(state => state.shop);

  console.log(id,location,currentShop)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(setCurrentShop(id));
  }, [dispatch, id]);

  if (!currentShop) return null;

  const tabs = [
    { path: "about", label: "À propos" },
    { path: "products", label: "Produits" },
    { path: "photos", label: "Photos" },
    { path: "reviews", label: "Avis" },
    { path: "faq", label: "FAQ" },
  ];

  const currentTab = location.pathname.split("/").pop();
  console.log(currentTab, location.pathname.endsWith("/shop"))
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-white to-accent/50">
      <div className="max-w-[1200px] mx-auto bg-white/80 backdrop-blur-sm shadow-lg">
        <ShopBanner banner={currentShop.banner} alt={`Bannière de ${currentShop.name}`} />
        <ShopHeader id={currentShop.id} name={currentShop.name} products={currentShop.products} />
        <ShopTabs 
          tabs={tabs} 
          shopId={currentShop.id} 
          currentTab={currentTab || "about"} 
          className={isScrolled ? "shadow-lg" : ""}
        />
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ShopLayout;
