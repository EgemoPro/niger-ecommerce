import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tag, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";

const ProductFilters = ({ categories, onFilterChange, pricesRange }) => {
  /**
   * le paramètre `category` est utilisé pour identifier la catégorie de produits
   * actuellement affichée dans la liste des produits.
   */
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  console.log("category", category);

  const safePricesRange = Array.isArray(pricesRange) && pricesRange.length === 2
    ? pricesRange.map((v, i) => (Number.isFinite(v) ? v : i > 0 ? 5700 : 50))
    : [0, 1000]; // Valeurs par défaut si problème

  const [filters, setFilters] = useState({
    category: category || "all",
    priceRange: [...safePricesRange],
    searchTerm: "",
  });


  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: category || "all",
    }));
  }, [category]);


  console.log("filters", filters);
  const updateFilters = useCallback(
    (newFilters) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, ...newFilters };
        onFilterChange(updatedFilters);
        return updatedFilters;
      });
    },
    [onFilterChange]
  );


  const handleCategoryChange = useCallback(
    (category) => {
      updateFilters({ category });
    },
    [updateFilters]
  );

  const handlePriceChange = useCallback(
    (newValue) => {
      // Vérifie que newValue est un tableau de deux nombres valides
      const safeValue = Array.isArray(newValue) && newValue.length === 2
        ? newValue.map((v, i) =>
          Number.isFinite(v)
            ? v
            : safePricesRange[i]
        )
        : [...safePricesRange];
      updateFilters({ priceRange: safeValue });
    },
    [updateFilters, safePricesRange]
  );

  const handleSearchChange = useCallback(
    (event) => {
      updateFilters({ searchTerm: event.target.value });
    },
    [updateFilters]
  );

  return (
    <div className="flex flex-col max-md:gap-3 w-full">
      <div className="flex max-md:flex-col flex-row gap-2 h-auto">
        <div className="md:grid max-md:grid-cols-4 max-md:w-full flex md:w-2/5 gap-2 p-2">
          <div className="relative max-md:col-span-3 w-full right-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>

        </div>

        {/* categorie liste  */}
        <ScrollArea className="max-md:w-full md:w-2/3 h-auto p-2">
          <div className="flex gap-2">
            <Button
              variant={filters.category === "all" ? "default" : "outline"}
              onClick={() => handleCategoryChange("all")}
              className="whitespace-nowrap text-xs"
            >
              <Tag className="mr-1 h-3 w-3" />
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                onClick={() => handleCategoryChange(category)}
                className="whitespace-nowrap text-xs"
              >
                <Tag className="mr-1 h-3 w-3" />
                {category}
              </Button>
            ))}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex md:justify-between items-center gap-3 p-1">
        <span className="text-green-600 text-sm font-semibold text-center w-1/4">
          {filters.priceRange[0]} FCFA
        </span>
        <Slider
          min={pricesRange[0]}
          max={pricesRange[1]}
          step={10}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="md:w-4/6 w-1/2"
        />
        <span className="text-green-600 text-sm font-semibold text-center w-1/4">
          {filters.priceRange[1]} FCFA
        </span>
      </div>
    </div>
  );
};

export default ProductFilters;
