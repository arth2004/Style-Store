import { useDispatch, useSelector } from "react-redux";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useEffect, useState } from "react";
import {
  setCategories,
  setChecked,
  setProducts,
} from "../redux/feauture/shop/shopSlice";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { 
  AiOutlineFilter, 
  AiOutlineClose, 
  AiOutlineSearch,
  AiOutlineStar,
  AiOutlineDollarCircle,
  AiOutlineTags,
  AiOutlineReload,
  AiOutlineShopping
} from "react-icons/ai";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, checked, radio, products } = useSelector(
    (state) => state.shop
  );
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // filter products based on both checked categories and price filter
        let filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // check if product price includes the entered price filter value
            const priceMatch = !priceFilter || 
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10);
            
            // check if product name/description includes search term
            const searchMatch = !searchTerm || 
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.brand.toLowerCase().includes(searchTerm.toLowerCase());

            return priceMatch && searchMatch;
          }
        );

        // Sort products
        if (sortBy === "price-low") {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
          filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name") {
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "rating") {
          filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter, searchTerm, sortBy]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  //Add all brands to unique brands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    dispatch(setChecked([]));
    dispatch(setProducts(filteredProductsQuery.data || []));
    setPriceFilter("");
    setSearchTerm("");
    setSortBy("default");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (checked.length > 0) count++;
    if (priceFilter) count++;
    if (searchTerm) count++;
    if (sortBy !== "default") count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button
          onClick={toggleFilters}
          className="bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          {showFilters ? (
            <AiOutlineClose size={20} />
          ) : (
            <AiOutlineFilter size={20} />
          )}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#50C878] to-[#45a06a] bg-clip-text text-transparent">
            SHOP PRODUCTS
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover amazing products with our advanced filters and search capabilities. 
            Find exactly what you're looking for from our curated collection.
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search products, brands, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#101011] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#50C878] focus:ring-2 focus:ring-[#50C878]/20 transition-all duration-200"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-[#101011] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#50C878] focus:ring-2 focus:ring-[#50C878]/20 transition-all duration-200"
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>

            {/* Active Filters Badge */}
            {getActiveFiltersCount() > 0 && (
              <div className="bg-[#50C878] text-white px-4 py-2 rounded-full text-sm font-semibold">
                {getActiveFiltersCount()} Active Filters
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div
            className={`
            ${
              showFilters
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            fixed lg:relative top-0 left-0 h-full lg:h-auto w-80 lg:w-80 bg-[#151515] lg:bg-transparent p-6 lg:p-3 z-40 transition-transform duration-300 ease-in-out
            lg:transform-none overflow-y-auto
          `}
          >
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <AiOutlineFilter className="text-[#50C878]" />
                Filters
              </h2>
              <button
                onClick={toggleFilters}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Categories Filter */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-xl mb-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AiOutlineTags className="text-[#50C878]" />
                Categories
              </h3>
              <div className="space-y-3">
                {categories?.map((c) => (
                  <div key={c._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-[#50C878] bg-[#F5F5F5] border-[#F5F5F5] rounded focus:ring-[#50C878] focus:ring-2"
                    />
                    <label
                      htmlFor={`category-${c._id}`}
                      className="ml-3 text-sm font-medium text-white cursor-pointer hover:text-[#50C878] transition-colors"
                    >
                      {c.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-xl mb-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AiOutlineShopping className="text-[#50C878]" />
                Brands
              </h3>
              <div className="space-y-3">
                {uniqueBrands?.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-[#50C878] bg-[#F5F5F5] border-[#F5F5F5] focus:ring-[#50C878] focus:ring-2"
                    />
                    <label
                      htmlFor={brand}
                      className="ml-3 text-sm font-medium text-white cursor-pointer hover:text-[#50C878] transition-colors"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-xl mb-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AiOutlineDollarCircle className="text-[#50C878]" />
                Price Range
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter max price..."
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full px-3 py-2 bg-[#101011] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#50C878] focus:ring-2 focus:ring-[#50C878]/20 transition-all duration-200"
                />
                <p className="text-xs text-gray-400">
                  Enter a price to filter products below that amount
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <div className="p-2">
              <button
                onClick={resetFilters}
                className="w-full bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
              >
                <AiOutlineReload />
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Enhanced Products Section */}
          <div className="flex-1 lg:ml-0">
            {/* Results Header */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 mb-8 border border-gray-700">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <AiOutlineShopping className="text-[#50C878]" />
                    {products?.length || 0} Products Found
                  </h2>
                  {getActiveFiltersCount() > 0 && (
                    <p className="text-gray-400 mt-1">
                      Showing filtered results
                    </p>
                  )}
                </div>
                
                {sortBy !== "default" && (
                  <div className="text-sm text-gray-400">
                    Sorted by: {sortBy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-12 max-w-md mx-auto border border-gray-700">
                  <AiOutlineSearch className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#50C878] text-white font-semibold rounded-lg py-3 px-6 hover:bg-[#45a06a] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                {products?.map((p) => (
                  <div
                    key={p._id}
                    className="h-full transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#50C878]/20"
                  >
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {showFilters && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleFilters}
        />
      )}
    </div>
  );
};

export default Shop;
