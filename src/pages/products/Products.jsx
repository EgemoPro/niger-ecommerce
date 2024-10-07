import React from "react";
import ProductCard from "../../components/ProductCard.jsx";
import ProductGrid from "../../components/product-grid-component.jsx";
import PhoneProductCard from "../../components/PhoneProductCarde.jsx";




function Products() {
  const [isProductCardOpen, setIsProductCardOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState([])
  const handleOpen = (product)=>{
    setIsProductCardOpen(true)
    setSelectedProduct(product)
  }

  return (
    <div className="h-screen flex justify-center items-center  bg-gray-100 overflow-hidden">
      {isProductCardOpen && (
        <PhoneProductCard product={selectedProduct} onClose={() => setIsProductCardOpen(false)} />
      )}
      <ProductGrid onOpen={handleOpen} />
    </div>
  );
}

export default Products;
