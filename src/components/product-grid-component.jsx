import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import ProductFilters from "./product-grid-components/ProductFilters";
import ProductGridHeader from "./product-grid-components/ProductGridHeader";
import ProductList from "./product-grid-components/ProductList";

const ProductGrid = ({ onOpen }) => {
  const [favorites, setFavorites] = useState({});
  const products = useSelector((state) => state.data);

  const { minPrice, maxPrice, categories } = useMemo(() => {
    const prices = products.map(product => product.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      categories: [...new Set(products.map((product) => product.category))]
    };
  }, [products]);

  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [minPrice, maxPrice],
    searchTerm: "",
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [minPrice, maxPrice]
    }));
  }, [minPrice, maxPrice]);

  const filterProducts = useCallback(() => {
    return products.filter((product) => (
      (filters.category === "all" || product.category === filters.category) &&
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1] &&
      product.title.toLowerCase().includes(filters.searchTerm.toLowerCase())&&
      product.quantity != 0
    ));
  }, [products, filters]);

  const sortProducts = useCallback((filteredProducts) => {
    return filteredProducts.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.reviews !== a.reviews) return b.reviews - a.reviews;
      if (a.price !== b.price) return a.price - b.price;
      return a.category.localeCompare(b.category);
    });
  }, []);

  const visibleProducts = useMemo(() => {
    const filteredProducts = filterProducts();
    return sortProducts(filteredProducts);
  }, [filterProducts, sortProducts]);

  const toggleFavorite = useCallback((productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <Card className="h-full w-full mx-auto">
      <ProductGridHeader />
      <CardContent>
        <ProductFilters
          categories={categories}
          onFilterChange={handleFilterChange}
          pricesRange={[minPrice,maxPrice]}
        />
        <ProductList
          visibleProducts={visibleProducts}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onOpen={onOpen}
        />
      </CardContent>
    </Card>
  );
};

export default ProductGrid;