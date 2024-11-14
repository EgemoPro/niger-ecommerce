import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tag, Search, ShoppingCart } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductFilters = ({ categories, onFilterChange, pricesRange }) => {
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [...pricesRange],
    searchTerm: "",
  });
  const backetState = useSelector((state) => state.basket);
  // console.log(backetState);

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
      updateFilters({ priceRange: newValue });
    },
    [updateFilters]
  );

  const handleSearchChange = useCallback(
    (event) => {
      updateFilters({ searchTerm: event.target.value });
    },
    [updateFilters]
  );

  return (
    <div className="flex flex-col max-md:gap-3 w-full">
      <div className="flex max-md:flex-col flex-row gap-2 mt-2 h-auto">
        <div className="max-md:grid max-md:grid-cols-4 max-md:w-full flex w-1/3 gap-2 p-2">
          <div className="relative max-md:col-span-3 md:w-2/3 ">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          <Button className="flex max-md:col-span-1 md:w-auto bg-transparent hover:bg-slate-400/10 border">
            <Link
              className="h-full w-full flex items-center justify-around gap-5 text-inherit"
              to={`/orders`}
            >
              <span className="h-6 w-6 p-2 transform max-md:-translate-x-3 text-gray-500 rounded-full flex justify-center items-center">
                {backetState.length}
              </span>
              <span className="h-6 w-6 p-2 max-md:hidden text-gray-500 rounded-full flex justify-center items-center">
                Panier
              </span>
            </Link>
            <ShoppingCart className="h-5 w-5 transform translate-x-1 text-gray-500" />
          </Button>
        </div>

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

      <div className="flex md:justify-between  items-center gap-3 p-1">
        <span className="text-green-600 text-sm font-semibold text-center w-1/4 ">
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
        <span className="text-green-600 text-sm font-semibold  text-center  w-1/4">
          {filters.priceRange[1]} FCFA
        </span>
      </div>
    </div>
  );
};

export default ProductFilters;
