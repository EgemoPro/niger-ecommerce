import React, {useState} from "react";
import ProductGrid from "../../components/product-grid-component.jsx";
import ProductDrawerCard from "../../components/ProductDrawerCard.jsx";

const  ProductsPage = () => {
  const [isProductDrawerCardOpen, setProductDrawerCardOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([])

  const handleOpen = (product)=>{
    setProductDrawerCardOpen(true)
    setSelectedProduct(product)
  }

  return (
    <div className="h-screen flex justify-center items-center overflow-hidden">
      {isProductDrawerCardOpen && (
        <ProductDrawerCard product={selectedProduct} onClose={() => setProductDrawerCardOpen(false)} />
      )}
      <ProductGrid onOpen={handleOpen} />
    </div>
  );
}

export default ProductsPage;
