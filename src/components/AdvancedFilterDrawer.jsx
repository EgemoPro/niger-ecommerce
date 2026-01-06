import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  X, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Euro,
  Palette,
  Ruler,
  Package,
  RotateCcw,
  Check,
  Menu,
  ShoppingBag
} from 'lucide-react';

// Simulation du store Redux et des données
const mockProducts = [
  {
    "id": "6826308864b95baf45bad468",
    "status": "available",
    "_id": "6826308864b95baf45bad468",
    "sku": "id-0001",
    "title": "Nike Air Max",
    "description": "Chaussure Nike Original",
    "brand": "Nike",
    "price": 3000,
    "stock": 300,
    "rating": 2.5,
    "reviews": 8,
    "category": "shoes",
    "available": true,
    "colors": ["red", "white", "black"],
    "sizes": [{"name": "US M 8", "dimensions": "US M 8. / W 10"}]
  },
  {
    "id": "6826308864b95baf45bad469",
    "status": "available",
    "_id": "6826308864b95baf45bad469",
    "sku": "id-0002",
    "title": "Adidas UltraBoost",
    "description": "Chaussure de running premium",
    "brand": "Adidas",
    "price": 4500,
    "stock": 150,
    "rating": 4.2,
    "reviews": 25,
    "category": "shoes",
    "available": true,
    "colors": ["blue", "white", "gray"],
    "sizes": [{"name": "US M 9", "dimensions": "US M 9. / W 11"}]
  },
  {
    "id": "6826308864b95baf45bad470",
    "status": "available",
    "_id": "6826308864b95baf45bad470",
    "sku": "id-0003",
    "title": "Samsung Galaxy S24",
    "description": "Smartphone dernière génération",
    "brand": "Samsung",
    "price": 89900,
    "stock": 50,
    "rating": 4.8,
    "reviews": 156,
    "category": "electronics",
    "available": true,
    "colors": ["black", "white", "blue"],
    "sizes": []
  },
  {
    "id": "6826308864b95baf45bad471",
    "status": "available",
    "_id": "6826308864b95baf45bad471",
    "sku": "id-0004",
    "title": "T-shirt Nike Dri-FIT",
    "description": "T-shirt de sport respirant",
    "brand": "Nike",
    "price": 2500,
    "stock": 200,
    "rating": 3.8,
    "reviews": 42,
    "category": "clothing",
    "available": true,
    "colors": ["red", "blue", "green", "black"],
    "sizes": [
      {"name": "S", "dimensions": "Small"},
      {"name": "M", "dimensions": "Medium"},
      {"name": "L", "dimensions": "Large"},
      {"name": "XL", "dimensions": "Extra Large"}
    ]
  }
];

// Hook personnalisé pour simuler Redux
const useProductStore = () => {
  const [products] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  
  return {
    products,
    filteredProducts,
    setFilteredProducts
  };
};

// Composant Drawer
const DrawerContent = ({ isOpen, onClose, children }) => (
  <>
    {/* Overlay */}
    <div 
      className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    />
    
    {/* Drawer */}
    <div className={`fixed top-0 right-0 h-full bg-white shadow-xl transition-transform duration-300 z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } w-full sm:w-96`}>
      {children}
    </div>
  </>
);

const ProductFilterDrawer = () => {
  const { products, filteredProducts, setFilteredProducts } = useProductStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    rating: 0,
    inStock: false
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    brand: false,
    color: false,
    size: false,
    rating: false
  });

  // Extraction des données dynamiques des produits
  const filterData = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))].map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: products.filter(p => p.category === cat).length
    }));

    const brands = [...new Set(products.map(p => p.brand))].map(brand => ({
      id: brand.toLowerCase(),
      name: brand,
      count: products.filter(p => p.brand === brand).length
    }));

    const colors = [...new Set(products.flatMap(p => p.colors || []))].map(color => ({
      id: color,
      name: color.charAt(0).toUpperCase() + color.slice(1),
      hex: getColorHex(color)
    }));

    const sizes = [...new Set(products.flatMap(p => p.sizes?.map(s => s.name) || []))];

    const priceRange = {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price))
    };

    return { categories, brands, colors, sizes, priceRange };
  }, [products]);

  // Fonction pour obtenir la couleur hex
  const getColorHex = (colorName) => {
    const colorMap = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#22c55e',
      black: '#000000',
      white: '#ffffff',
      gray: '#6b7280',
      grey: '#6b7280'
    };
    return colorMap[colorName.toLowerCase()] || '#6b7280';
  };

  // Filtrage des produits
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Filtre prix
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filtre catégories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    // Filtre marques
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand.toLowerCase()));
    }

    // Filtre couleurs
    if (filters.colors.length > 0) {
      filtered = filtered.filter(p => 
        p.colors?.some(color => filters.colors.includes(color))
      );
    }

    // Filtre tailles
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes?.some(size => filters.sizes.includes(size.name))
      );
    }

    // Filtre note
    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    // Filtre stock
    if (filters.inStock) {
      filtered = filtered.filter(p => p.available && p.stock > 0);
    }

    setFilteredProducts(filtered);
  }, [filters, products, setFilteredProducts]);

  // Appliquer les filtres à chaque changement
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceRange: [0, filterData.priceRange.max],
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      rating: 0,
      inStock: false
    });
  }, [filterData.priceRange.max]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < filterData.priceRange.max) count++;
    if (filters.categories.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    return count;
  }, [filters, filterData.priceRange.max]);

  const FilterSection = ({ title, isExpanded, onToggle, icon: Icon, children }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-gray-600" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isExpanded ? 
          <ChevronUp size={16} className="text-gray-400" /> : 
          <ChevronDown size={16} className="text-gray-400" />
        }
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );

  const PriceRangeSlider = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{filters.priceRange[0]} F CFA</span>
        <span>{filters.priceRange[1]} F CFA</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max={filterData.priceRange.max}
          step="100"
          value={filters.priceRange[0]}
          onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
        />
        <input
          type="range"
          min="0"
          max={filterData.priceRange.max}
          step="100"
          value={filters.priceRange[1]}
          onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
        />
      </div>
    </div>
  );

  const CheckboxItem = ({ id, name, count, isChecked, onChange }) => (
    <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            checked={isChecked}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
            isChecked 
              ? 'bg-blue-600 border-blue-600' 
              : 'border-gray-300 hover:border-blue-400'
          }`}>
            {isChecked && (
              <Check size={14} className="text-white absolute top-0.5 left-0.5" />
            )}
          </div>
        </div>
        <span className="text-gray-700">{name}</span>
      </div>
      {count && (
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </label>
  );

  const ColorPicker = () => (
    <div className="grid grid-cols-6 gap-2">
      {filterData.colors.map(color => (
        <button
          key={color.id}
          onClick={() => toggleArrayFilter('colors', color.id)}
          className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
            filters.colors.includes(color.id)
              ? 'border-blue-600 scale-110 shadow-lg'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{ backgroundColor: color.hex }}
          title={color.name}
        >
          {filters.colors.includes(color.id) && (
            <Check 
              size={16} 
              className={color.hex === '#ffffff' ? 'text-gray-800' : 'text-white'} 
            />
          )}
        </button>
      ))}
    </div>
  );

  const SizePicker = () => (
    <div className="grid grid-cols-3 gap-2">
      {filterData.sizes.map(size => (
        <button
          key={size}
          onClick={() => toggleArrayFilter('sizes', size)}
          className={`p-2 text-center border rounded-lg transition-all duration-200 ${
            filters.sizes.includes(size)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );

  const StarRating = () => (
    <div className="space-y-2">
      {[4, 3, 2, 1].map(rating => (
        <button
          key={rating}
          onClick={() => updateFilter('rating', rating)}
          className={`flex items-center gap-2 p-2 w-full rounded-lg transition-colors duration-200 ${
            filters.rating === rating ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm">& plus</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Barre de démonstration */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={24} />
            E-commerce Demo
          </h1>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter size={18} />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Affichage de {filteredProducts.length} sur {products.length} produits
        </div>
      </div>

      {/* Liste des produits filtrés (demo) */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg border p-4 shadow-sm">
            <h3 className="font-medium text-gray-900">{product.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{product.price} F CFA</span>
              <span className={`text-sm px-2 py-1 rounded ${
                product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.available ? 'En stock' : 'Rupture'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer des filtres */}
      <DrawerContent isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                disabled={activeFiltersCount === 0}
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Contenu des filtres */}
          <div className="flex-1 overflow-y-auto">
            {/* Prix */}
            <FilterSection
              title="Prix"
              isExpanded={expandedSections.price}
              onToggle={() => toggleSection('price')}
              icon={Euro}
            >
              <PriceRangeSlider />
            </FilterSection>

            {/* Catégories */}
            {filterData.categories.length > 0 && (
              <FilterSection
                title="Catégories"
                isExpanded={expandedSections.category}
                onToggle={() => toggleSection('category')}
                icon={Package}
              >
                <div className="space-y-1">
                  {filterData.categories.map(category => (
                    <CheckboxItem
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      count={category.count}
                      isChecked={filters.categories.includes(category.id)}
                      onChange={() => toggleArrayFilter('categories', category.id)}
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Marques */}
            {filterData.brands.length > 0 && (
              <FilterSection
                title="Marques"
                isExpanded={expandedSections.brand}
                onToggle={() => toggleSection('brand')}
                icon={Package}
              >
                <div className="space-y-1">
                  {filterData.brands.map(brand => (
                    <CheckboxItem
                      key={brand.id}
                      id={brand.id}
                      name={brand.name}
                      count={brand.count}
                      isChecked={filters.brands.includes(brand.id)}
                      onChange={() => toggleArrayFilter('brands', brand.id)}
                    />
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Couleurs */}
            {filterData.colors.length > 0 && (
              <FilterSection
                title="Couleurs"
                isExpanded={expandedSections.color}
                onToggle={() => toggleSection('color')}
                icon={Palette}
              >
                <ColorPicker />
              </FilterSection>
            )}

            {/* Tailles */}
            {filterData.sizes.length > 0 && (
              <FilterSection
                title="Tailles"
                isExpanded={expandedSections.size}
                onToggle={() => toggleSection('size')}
                icon={Ruler}
              >
                <SizePicker />
              </FilterSection>
            )}

            {/* Note */}
            <FilterSection
              title="Note minimum"
              isExpanded={expandedSections.rating}
              onToggle={() => toggleSection('rating')}
              icon={Star}
            >
              <StarRating />
            </FilterSection>

            {/* Stock */}
            <div className="p-4 border-b">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                  filters.inStock 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}>
                  {filters.inStock && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
                <span className="text-gray-700">En stock uniquement</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <button
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              onClick={() => {
                setIsDrawerOpen(false);
                console.log('Filtres appliqués:', filters);
                console.log('Produits filtrés:', filteredProducts);
              }}
            >
              Voir {filteredProducts.length} produits
            </button>
          </div>
        </div>
      </DrawerContent>

      {/* CSS pour les sliders */}
      <style jsx>{`
        .range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .range-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
};

export default ProductFilterDrawer;