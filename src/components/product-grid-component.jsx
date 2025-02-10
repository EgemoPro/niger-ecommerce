import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import ProductFilters from "./product-grid-components/ProductFilters";
import ProductGridHeader from "./product-grid-components/ProductGridHeader";
import ProductList from "./product-grid-components/ProductList";
import { fetchInitialData } from "../redux/Slices/initialData";
// import { useLoaderData } from "react-router-dom";

const ProductGrid = ({ onOpen }) => {
  const [favorites, setFavorites] = useState({});
  const dispatch = useDispatch();

  // const products = useLoaderData()
  const { data: products, status, error } = useSelector((state) => state.data);

  console.log(products, status, error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchInitialData());
    } 
  }, [status, dispatch]);

  // Cette fonction calcule et mémorise les valeurs suivantes à partir des produits:
  // - Le prix minimum parmi tous les produits
  // - Le prix maximum parmi tous les produits
  // - Un tableau des catégories uniques extraites des produits
  // La fonction n'est recalculée que si la liste des produits change
  const { minPrice, maxPrice, categories } = useMemo(() => {
    const prices = products.map((product) => product.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      categories: [...new Set(products.map((product) => product.category))],
    };
  }, [products]);

  // État initial des filtres avec:
  // - Une catégorie par défaut "all"
  // - Une fourchette de prix allant du min au max calculés
  // - Un terme de recherche vide
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [minPrice, maxPrice],
    searchTerm: "",
  });

  // Ce useEffect met à jour la fourchette de prix des filtres
  // chaque fois que le prix minimum ou maximum change
  // tout en préservant les autres valeurs des filtres
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [minPrice, maxPrice],
    }));
  }, [minPrice, maxPrice]);

  // Cette fonction filtre les produits selon plusieurs critères:
  // 1. Vérifie si la catégorie sélectionnée correspond à "all" ou à la catégorie du produit
  // 2. Vérifie si le prix du produit est dans la fourchette de prix sélectionnée
  // 3. Vérifie si le titre du produit contient le terme de recherche (insensible à la casse)
  // 4. Vérifie si le produit est en stock (quantité différente de 0)
  const filterProducts = useCallback(() => {
    return products.filter((product) => {
      const searchRegex = new RegExp(filters.searchTerm, "i");
      return (
        (filters.category === "all" || product.category === filters.category) &&
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1] &&
        searchRegex.test(product.title) &&
        product.quantity != 0
      );
    });
  }, [products, filters]);

  // Cette fonction trie les produits selon plusieurs critères dans l'ordre suivant:
  // 1. Par note (rating) décroissante - les meilleurs notes apparaissent en premier
  // 2. En cas d'égalité de notes, trie par nombre de reviews décroissant
  // 3. En cas d'égalité de reviews, trie par prix croissant (du moins cher au plus cher)
  // 4. En dernier recours, trie par ordre alphabétique des catégories
  const sortProducts = useCallback((filteredProducts) => {
    return filteredProducts.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.reviews !== a.reviews) return b.reviews - a.reviews;
      if (a.price !== b.price) return a.price - b.price;
      return a.category.localeCompare(b.category);
    });
  }, []);

  // Cette fonction mémorisée calcule les produits visibles en:
  // 1. Appliquant d'abord les filtres via filterProducts()
  // 2. Triant ensuite les produits filtrés via sortProducts()
  // La mémoisation évite des recalculs inutiles si filterProducts ou sortProducts n'ont pas changé
  const visibleProducts = useMemo(() => {
    const filteredProducts = filterProducts();
    return sortProducts(filteredProducts);
  }, [filterProducts, sortProducts]);

  // Cette fonction mémorisée gère le basculement des favoris pour un produit donné
  // Elle utilise un setter fonctionnel pour mettre à jour l'état des favoris de manière sûre
  // en inversant la valeur booléenne associée à l'ID du produit
  const toggleFavorite = useCallback((productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }, []);

  // Cette fonction mémorisée met à jour l'état des filtres
  // Elle est appelée lorsque l'utilisateur modifie les critères de filtrage
  // La mémoisation évite de recréer la fonction à chaque rendu
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);
  return (
    <Card className="h-full w-full rounded-none">
      <ProductGridHeader />
      <CardContent className="px-1">
        <ProductFilters
          categories={categories}
          onFilterChange={handleFilterChange}
          pricesRange={[minPrice, maxPrice]}
        />
        <ProductList
          visibleProducts={visibleProducts}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onOpen={onOpen}
          isDataLoadig={status === "loading"}
        />
      </CardContent>
    </Card>
  );
};

export default ProductGrid;
