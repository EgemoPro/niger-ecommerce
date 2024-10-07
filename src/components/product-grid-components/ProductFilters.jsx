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
  const backetState = useSelector((state) => state.backet);
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
    <div className="flex flex-col  space-y-2">
      <div className="flex flex-col sm:flex-row  sm:-mb-10 sm:space-x-4 mt-2 ">
        <div className="grid grid-cols-4 w-full sm:w-1/3 sm:mb-0 ">
          <div className="relative col-span-3">
            <Search className="absolute left-2 md:top-1/4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          <Button className="ml-2 flex w-30">
            <Link
              className="h-full w-full flex items-center gap-5 text-inherit"
              to={`/orders`}
            >
              <span className="h-6 w-6 p-2 bg-white/20 rounded-full flex justify-center items-center">
                {backetState.length}
              </span>
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <ScrollArea className="w-full sm:w-2/3 h-20 mt-3 md:mt-0">
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

      <div className="flex md:justify-between items-center gap-3">
        <Slider
          min={pricesRange[0]}
          max={pricesRange[1]}
          step={10}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="md:w-4/6 w-1/2"
        />
        <div className="flex gap-1  md:w-72 w-1/2 items-center justify-around text-sm bg-gray-100 rounded-lg p-2 shadow-sm">
          <span className="text-green-600">
            {filters.priceRange[0]} FCFA
          </span>
          <span className="text-green-600">
            {filters.priceRange[1]} FCFA
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
