import React from "react";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import moment from "moment";
import AdminMenu from "./AdminMenu";
import {
  FaBox,
  FaDollarSign,
  FaTags,
  FaImage,
  FaEdit,
  FaEye,
  FaPlus,
  FaShoppingBag,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaStar,
} from "react-icons/fa";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  console.log(products);
  
  // Calculate product statistics
  const totalProducts = products?.length || 0;
  const totalValue =
    products?.reduce((sum, product) => {
      const price = typeof product.price === "number" ? product.price : 0;
      const stock =
        typeof product.countInStock === "number" ? product.countInStock : 0;
      return sum + price * stock;
    }, 0) || 0;
  const lowStockProducts =
    products?.filter((product) => {
      const stock =
        typeof product.countInStock === "number" ? product.countInStock : 0;
      return stock < 10 && stock > 0;
    }).length || 0;
  const outOfStockProducts =
    products?.filter((product) => {
      const stock =
        typeof product.countInStock === "number" ? product.countInStock : 0;
      return stock === 0;
    }).length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FaExclamationTriangle className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Error Loading Products
            </h2>
            <p className="text-gray-400 mb-6">
              There was an error loading the products. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FaBox className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No Products Found
            </h2>
            <p className="text-gray-400 mb-6">
              There are no products in the system yet. Start by adding your
              first product!
            </p>
            <Link
              to="/admin/productlist"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-medium"
            >
              <FaPlus className="text-sm" />
              Add First Product
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FaBox className="text-[#50C878]" />
            Product Management
          </h1>
          <p className="text-gray-400">Manage all products in your store</p>
        </div>

        {/* Product Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-white">{totalProducts}</p>
              </div>
              <div className="bg-[#50C878]/20 p-3 rounded-lg">
                <FaBox className="text-2xl text-[#50C878]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-[#50C878]">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <div className="bg-[#50C878]/20 p-3 rounded-lg">
                <FaDollarSign className="text-2xl text-[#50C878]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {lowStockProducts}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <FaExclamationTriangle className="text-2xl text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-red-400">
                  {outOfStockProducts}
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <FaExclamationTriangle className="text-2xl text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Menu and Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Menu */}
          <div className="absolute">
            <AdminMenu />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaShoppingBag className="text-[#50C878]" />
                    All Products ({totalProducts})
                  </h2>
                  <Link
                    to="/admin/productlist"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-medium"
                  >
                    <FaPlus className="text-sm" />
                    Add Product
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-gradient-to-br from-[#101011] to-[#1a1a1a] rounded-xl border border-gray-700 p-6 hover:border-[#50C878]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#50C878]/10"
                    >
                      {/* Product Image */}
                      <div className="relative mb-4">
                        <img
                          src={
                            typeof product.image === "string"
                              ? product.image
                              : ""
                          }
                          alt={
                            typeof product.name === "string"
                              ? product.name
                              : "Product"
                          }
                          className="w-full h-48 object-cover rounded-lg border border-gray-600"
                        />
                        <div className="absolute top-2 right-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${(() => {
                              const stock =
                                typeof product.countInStock === "number"
                                  ? product.countInStock
                                  : 0;
                              if (stock === 0)
                                return "bg-red-500/20 text-red-400 border border-red-500/30";
                              if (stock < 10)
                                return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
                              return "bg-green-500/20 text-green-400 border border-green-500/30";
                            })()}`}
                          >
                            {(() => {
                              const stock =
                                typeof product.countInStock === "number"
                                  ? product.countInStock
                                  : 0;
                              return `${stock} in stock`;
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-bold text-white line-clamp-2">
                            {typeof product.name === "string"
                              ? product.name
                              : "Unnamed Product"}
                          </h3>
                          <span className="text-2xl font-bold text-[#50C878]">
                            $
                            {typeof product.price === "number"
                              ? product.price.toFixed(2)
                              : "0.00"}
                          </span>
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-3">
                          {typeof product.description === "string"
                            ? product.description
                            : "No description available"}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaTags className="text-[#50C878]" />
                            <span>
                              {typeof product.category.name === "string"
                                ? product.category.name
                                : "Uncategorized"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-[#50C878]" />
                            <span>
                              {product.createdAt
                                ? moment(product.createdAt).format(
                                    "MMM DD, YYYY"
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {product.rating &&
                          typeof product.rating === "number" && (
                            <div className="flex items-center gap-2">
                              <FaStar className="text-yellow-500" />
                              <span className="text-gray-300">
                                {product.rating.toFixed(1)}
                              </span>
                              <span className="text-gray-500 text-sm">
                                ({product.numReviews || 0} reviews)
                              </span>
                            </div>
                          )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3">
                          <Link
                            to={`/admin/product/update/${product._id}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-medium"
                          >
                            <FaEdit className="text-sm" />
                            Edit
                          </Link>
                          <Link
                            to={`/product/${product._id}`}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                          >
                            <FaEye className="text-sm" />
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
