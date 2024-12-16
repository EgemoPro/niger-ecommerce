import React, {useState} from "react";
// import ProductCard from "../../components/ProductCard.jsx";
import ProductGrid from "../../components/product-grid-component.jsx";
import PhoneProductCard from "../../components/PhoneProductCarde.jsx";




function Products() {
  const [isProductCardOpen, setIsProductCardOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([])

  const handleOpen = (product)=>{
    setIsProductCardOpen(true)
    setSelectedProduct(product)
  }

  return (
    <div className="h-screen flex justify-center items-center overflow-hidden">
      {isProductCardOpen && (
        <PhoneProductCard product={selectedProduct} onClose={() => setIsProductCardOpen(false)} />
      )}
      <ProductGrid onOpen={handleOpen} />
    </div>
  );
}

export default Products;
