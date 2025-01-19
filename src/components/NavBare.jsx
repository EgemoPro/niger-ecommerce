import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShoppingCart,
  ShoppingBag,
  Search,
  Package,
  Menu,
  // UserPlus,
  // User2
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import AuthBtn from "./auth/auth-btn";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
/**
 * Mettre en place le lien vers le produits dans les parametres de recherche
 * mettre en place une gestion des requetes de type de contenu via redux-toolkit
 * tester l'uniformiter des state de redux
 */

const Logo = () => (
  <div className="flex items-center gap-2">
    <ShoppingBag className="text-blue-600 mr-2" />
    <span className="font-semibold text-lg">QuickShop</span>
  </div>
);

const NavigationItems = () => (
  <div className="hidden md:flex items-center gap-6">
    {/* <Button variant="ghost" className="text-gray-600">
      Tarifs
    </Button> */}
    <Button variant="ghost" className="text-gray-600">
      <Link to={`/orders`} className="w-full h-full" >
      <ShoppingCart className="w-5 h-5" />
      </Link>
    </Button>
    <AuthBtn/>
  </div>
);

const SearchResults = ({
  groupedProducts,
  selectedIndex,
  selectProduct,
  flattenedProducts,
  setSelectedIndex,
}) => {
  return (
    <>
      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category}>
          <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50">
            {category}
          </div>
          {items.map((product) => {
            const index = flattenedProducts.findIndex(
              (p) => p.id === product.id
            );
            return (
              <div
                key={product.id}
                className={`px-4 py-2 flex items-center justify-between cursor-pointer ${
                  selectedIndex === index ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => selectProduct(product)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <Link
                    to={`/product/${product.id.replace("#", "")}`}
                    className="w-full h-full"
                  >
                    {product.title}
                  </Link>
                </div>
                <span className="text-sm text-gray-500">{product.price}</span>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  setIsOpen,
  handleKeyDown,
  inputRef,
}) => (
  <div className="relative w-full">
    <Input
      ref={inputRef}
      type="text"
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setIsOpen(true);
      }}
      onFocus={() => setIsOpen(true)}
      onKeyDown={handleKeyDown}
      placeholder="Rechercher des produits..."
      className="w-full pl-4 pr-10"
    />
    <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  </div>
);

const AutocompleteDropdown = ({
  isOpen,
  dropdownRef,
  groupedProducts,
  filteredProducts,
  selectedIndex,
  selectProduct,
  flattenedProducts,
  setSelectedIndex,
}) =>
  isOpen && (
    <Card
      ref={dropdownRef}
      className="absolute z-50 md:w-full max-md:w-[92%] md:mt-10 max-h-[400px] overflow-auto shadow-lg"
    >
      {filteredProducts.length > 0 ? (
        <SearchResults
          groupedProducts={groupedProducts}
          selectedIndex={selectedIndex}
          selectProduct={selectProduct}
          flattenedProducts={flattenedProducts}
          setSelectedIndex={setSelectedIndex}
        />
      ) : (
        <div className="px-4 py-8 text-center text-gray-500">
          Aucun résultat trouvé.
        </div>
      )}
    </Card>
  );

const useAutocomplete = (products) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const flattenedProducts = Object.values(groupedProducts).flat();

  const selectProduct = (product) => {
    setSearchQuery(product.title);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flattenedProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectProduct(flattenedProducts[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return {
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    filteredProducts,
    groupedProducts,
    flattenedProducts,
    selectProduct,
    handleKeyDown,
  };
};

const Navbar = ({ data }) => {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    filteredProducts,
    groupedProducts,
    flattenedProducts,
    selectProduct,
    handleKeyDown,
  } = useAutocomplete(data);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="absolute z-50 w-full px-4 py-3 bg-white shadow-sm">
      <div className="flex items-center bg--900 justify-between">
        <Logo />

        <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsOpen={setIsOpen}
            handleKeyDown={handleKeyDown}
            inputRef={inputRef}
          />

          <AutocompleteDropdown
            isOpen={isOpen}
            dropdownRef={dropdownRef}
            groupedProducts={groupedProducts}
            filteredProducts={filteredProducts}
            selectedIndex={selectedIndex}
            selectProduct={selectProduct}
            flattenedProducts={flattenedProducts}
            setSelectedIndex={setSelectedIndex}
          />
        </div>

        <NavigationItems />
        <div className="md:hidden flex items-center gap-3 ">
          {/* Fonctionnalités de login */}
          <AuthBtn/>
          <button
            className="md:hidden text-gray-600 hover:text-gray-800"
            onClick={toggleMenu}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="mb-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setIsOpen={setIsOpen}
              handleKeyDown={handleKeyDown}
              inputRef={inputRef}
            />

            <AutocompleteDropdown
              isOpen={isOpen}
              dropdownRef={dropdownRef}
              groupedProducts={groupedProducts}
              filteredProducts={filteredProducts}
              selectedIndex={selectedIndex}
              selectProduct={selectProduct}
              flattenedProducts={flattenedProducts}
              setSelectedIndex={setSelectedIndex}
            />
          </div>
          {/* ici les liens secondaires */}
          <div className="flex flex-col space-y-2">
           
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;