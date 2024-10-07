import React, { useState } from "react";
import { ShoppingCart, Search, PackageX, Menu, ShoppingBag } from "lucide-react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
} from "@headlessui/react";

const products = [
  "Smartphone",
  "Ordinateur portable",
  "Tablette",
  "Casque audio",
  "Enceinte bluetooth",
  "Montre connectée",
  "Caméra",
  "Clavier",
  "Souris",
  "Écran",
];

const NavBare = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredProducts =
    query === ""
      ? products
      : products.filter((product) =>
          product.toLowerCase().includes(query.toLowerCase())
        );

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuery("");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingBag className="text-blue-600 mr-2" />
              <span className="text-xl font-bold">QuickShop</span>
            </div>
            <div className="hidden md:flex flex-grow mx-4 max-w-96">
              <Combobox value={selectedProduct} onChange={handleProductSelect}>
                <div className="relative w-full">
                  <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <ComboboxInput
                      className="w-full border border-gray-300 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:border-gray-500 rounded-lg"
                      displayValue={(product) => product}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Rechercher des produits..."
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <Search
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </ComboboxButton>
                  </div>
                  {query !== "" && (
                    <ComboboxOption className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredProducts.length === 0 ? (
                        <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700 flex items-center">
                          <PackageX className="mr-2 h-5 w-5" />
                          Aucun produit trouvé.
                        </div>
                      ) : (
                        filteredProducts.map((product) => (
                          <ComboboxOption
                            key={product}
                            className={({ active }) =>
                              `relative cursor-default select-none pl-10 pr-4 ${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                            value={product}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {product}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      active ? "text-white" : "text-blue-600"
                                    }`}
                                  >
                                    ✓
                                  </span>
                                ) : null}
                              </>
                            )}
                          </ComboboxOption>
                        ))
                      )}
                    </ComboboxOption>
                  )}
                </div>
              </Combobox>
            </div>
            <div className="hidden md:flex items-center">
              <a href="#" className="text-gray-600 hover:text-gray-800 mr-4">
                Fonctionnalités
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800 mr-4">
                Tarifs
              </a>
              <button className=" text-blue-500 px-4 py-2 rounded-md hover:text-blue-600 hover:scale-110">
                  <ShoppingCart className="ml-2 h-5 w-5" />
                </button>
            </div>
            <button
              className="md:hidden text-gray-600 hover:text-gray-800"
              onClick={toggleMenu}
            >
              <Menu size={24} />
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4">
              <div className="mb-4">
                <Combobox
                  value={selectedProduct}
                  onChange={handleProductSelect}
                >
                  <div className="relative w-full">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        className="w-full border border-gray-300 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:border-gray-500 rounded-lg"
                        displayValue={(product) => product}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Rechercher des produits..."
                      />
                      <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <Search
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </ComboboxButton>
                    </div>
                    {query !== "" && (
                      <ComboboxOption className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredProducts.length === 0 ? (
                          <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700 flex items-center">
                            <PackageX className="mr-2 h-5 w-5" />
                            Aucun produit trouvé.
                          </div>
                        ) : (
                          filteredProducts.map((product) => (
                            <ComboboxOption
                              key={product}
                              className={({ active }) =>
                                `relative cursor-default select-none pl-10 pr-4 ${
                                  active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-900"
                                }`
                              }
                              value={product}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {product}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                        active ? "text-white" : "text-blue-600"
                                      }`}
                                    >
                                      ✓
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </ComboboxOption>
                          ))
                        )}
                      </ComboboxOption>
                    )}
                  </div>
                </Combobox>
              </div>
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Fonctionnalités
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Tarifs
                </a>
                <button className="text-blue-500  py-2 rounded-md hover:text-blue-600">
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default NavBare;
