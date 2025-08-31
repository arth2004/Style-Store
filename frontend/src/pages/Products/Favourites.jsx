import { useSelector } from "react-redux";
import Product from "./Product";
import { selectFavouriteProduct } from "../../redux/feauture/favourites/favouriteSlice";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaHome,
  FaShoppingBag,
  FaStar,
  FaGift,
  FaArrowRight,
} from "react-icons/fa";

const Favourites = () => {
  const favourites = useSelector(selectFavouriteProduct);

  // If no favorites, show empty state
  if (!favourites || favourites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#50C878] to-[#45a06a] bg-clip-text text-transparent">
              FAVORITE PRODUCTS
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your personal collection of loved products
            </p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
            <div className="mb-8">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center border border-gray-700">
                <FaHeart className="text-5xl text-gray-400" />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-4">
                No Favorites Yet
              </h2>
              <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                You haven't added any products to your favorites yet. Start
                exploring our amazing products and add them to your wishlist!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#50C878] to-[#45a06a] text-white font-bold rounded-xl hover:from-[#45a06a] hover:to-[#50C878] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaHome className="text-xl" />
                Go to Home
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-[#50C878] hover:text-[#50C878] transition-all duration-300 hover:scale-105"
              >
                <FaShoppingBag className="text-xl" />
                Browse Products
              </Link>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
              <div className="text-center p-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-gray-700">
                <FaHeart className="text-3xl text-[#50C878] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Save Favorites
                </h3>
                <p className="text-gray-400 text-sm">
                  Heart your favorite products for quick access later
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-gray-700">
                <FaStar className="text-3xl text-[#50C878] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Track Wishlist
                </h3>
                <p className="text-gray-400 text-sm">
                  Keep track of products you want to buy
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-gray-700">
                <FaGift className="text-3xl text-[#50C878] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Easy Shopping
                </h3>
                <p className="text-gray-400 text-sm">
                  Quick access to your most loved items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#50C878] to-[#45a06a] bg-clip-text text-transparent">
            FAVORITE PRODUCTS
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your personal collection of {favourites.length} amazing products
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <FaHeart className="text-2xl text-[#50C878]" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {favourites.length} Favorite
                  {favourites.length !== 1 ? "s" : ""}
                </h3>
                <p className="text-gray-400 text-sm">
                  Products you've added to your wishlist
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#333333] text-gray-300 rounded-lg hover:bg-[#444444] transition-colors"
              >
                <FaHome className="text-sm" />
                Home
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#50C878] to-[#45a06a] text-white rounded-lg hover:from-[#45a06a] hover:to-[#50C878] transition-all duration-300"
              >
                <FaShoppingBag className="text-sm" />
                Shop More
              </Link>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favourites.map((product) => (
            <div
              key={product._id}
              className="w-full transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#50C878]/20"
            >
              <Product product={product} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Discover More Amazing Products
            </h3>
            <p className="text-gray-300 mb-6">
              Keep exploring our collection and add more favorites to your
              wishlist
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#50C878] to-[#45a06a] text-white font-bold rounded-xl hover:from-[#45a06a] hover:to-[#50C878] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Browse All Products</span>
              <FaArrowRight className="text-lg" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favourites;
