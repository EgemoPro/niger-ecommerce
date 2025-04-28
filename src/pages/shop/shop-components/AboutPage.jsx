
import { useParams } from "react-router-dom";
import { popularShops } from "@/components/PopularShops";
import { ShopAbout } from "@/components/shop/ShopAbout";

const ShopAboutPage = () => {
  const { id } = useParams();
  const shop = popularShops.find((s) => s.id === id);

  if (!shop) return null;

  return (
    <ShopAbout 
      description={shop.description} 
      popularProducts={shop.popularProducts} 
    />
  );
};

export default ShopAboutPage;
