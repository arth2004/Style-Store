import { Link, useParams } from "react-router-dom";
import {
  useGetProductsQuery,
  useGetTopProductsQuery,
} from "../redux/api/productApiSlice";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";
import {
  FaShoppingBag,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const { data: topProducts, isLoading: topProductsLoading } =
    useGetTopProductsQuery();

  // Show loader if either API is loading
  const isAnyLoading = isLoading || (!keyword && topProductsLoading);

  return (
    <>
      {/* Only show Header when there's no search keyword */}
      {!keyword && <Header />}

      {isAnyLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader fullScreen={true} label="Loading your products..." />
        </div>
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Hero Section - Only show when no keyword */}
          {!keyword && (
            <section className="bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white py-16">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#50C878] to-[#45a06a] bg-clip-text text-transparent">
                    Welcome to StyleStore
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                    Discover amazing products at unbeatable prices. Quality
                    meets affordability in every item.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      to="/shop"
                      className="bg-gradient-to-r from-[#50C878] to-[#45a06a] text-white font-bold rounded-full py-4 px-8 text-lg hover:from-[#45a06a] hover:to-[#50C878] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FaShoppingBag className="inline mr-2" />
                      Start Shopping
                    </Link>
                    <Link
                      to="/shop"
                      className="border-2 border-[#50C878] text-[#50C878] font-semibold rounded-full py-4 px-8 text-lg hover:bg-[#50C878] hover:text-white transition-all duration-300 hover:scale-105"
                    >
                      Explore Products
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Features Section - Only show when no keyword */}
          {!keyword && (
            <section className="py-16 bg-[#1a1a1a]">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center text-white">
                    <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FaTruck className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Fast Delivery
                    </h3>
                    <p className="text-gray-400">
                      Quick and reliable shipping to your doorstep
                    </p>
                  </div>

                  <div className="text-center text-white">
                    <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FaShieldAlt className="text-xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Secure Shopping
                    </h3>
                    <p className="text-gray-400">
                      100% secure payment and data protection
                    </p>
                  </div>

                  <div className="text-center text-white">
                    <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FaStar className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Quality Products
                    </h3>
                    <p className="text-gray-400">
                      Curated selection of premium items
                    </p>
                  </div>

                  <div className="text-center text-white">
                    <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FaHeadset className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                    <p className="text-gray-400">Always here to help you</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Products Section */}
          <section className="py-16 bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a]">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {keyword
                    ? `Search Results for "${keyword}"`
                    : "Special Products"}
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  {keyword
                    ? `Found ${
                        data?.products?.length || 0
                      } products matching your search`
                    : "Discover our handpicked selection of amazing products"}
                </p>

                {!keyword && (
                  <div className="mt-8">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#50C878] to-[#45a06a] text-white font-semibold rounded-full py-3 px-8 text-lg hover:from-[#45a06a] hover:to-[#50C878] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FaShoppingBag className="text-xl" />
                      View All Products
                    </Link>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {data?.products && data.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                  {data.products.map((product) => (
                    <div
                      key={product._id}
                      className="transform hover:scale-105 transition-all duration-300"
                    >
                      <Product product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-[#1a1a1a] rounded-2xl p-12 max-w-md mx-auto">
                    <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {keyword
                        ? `No products match "${keyword}". Try a different search term.`
                        : "Check back soon for new products!"}
                    </p>
                    <Link
                      to="/shop"
                      className="bg-[#50C878] text-white font-semibold rounded-full py-3 px-6 hover:bg-[#45a06a] transition-colors"
                    >
                      Browse All Products
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Call to Action - Only show when no keyword */}
          {!keyword && (
            <section className="py-20 bg-gradient-to-r from-[#50C878] to-[#45a06a] text-white">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Ready to Start Shopping?
                </h2>
                <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who trust StyleStore for
                  quality products and exceptional service.
                </p>
                <Link
                  to="/shop"
                  className="bg-white text-[#50C878] font-bold rounded-full py-4 px-8 text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <FaShoppingBag className="inline mr-2" />
                  Shop Now
                </Link>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default Home;
