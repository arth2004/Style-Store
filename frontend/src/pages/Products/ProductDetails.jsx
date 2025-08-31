import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  useCreateReviewMutation,
  useGetProductByIdQuery,
  useGetProductDetailsQuery,
} from "../../redux/api/productApiSlice";
import { useDispatch, useSelector } from "react-redux";
import HeartIcon from "./HeartIcon";
import Loader from "../../components/Loader";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStarHalfAlt,
  FaRegStar,
  FaTags,
  FaWarehouse,
  FaDollarSign,
  FaCalendarAlt,
  FaEye,
  FaShoppingBag,
} from "react-icons/fa";
import moment from "moment";
import Message from "../../components/Message";
import Rating from "./Rating";
import ProductTabs from "./ProductTabs";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/feauture/cart/cartSlice";
import backendBaseUrl from "../../config";
import React from "react";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  console.log(product);
  
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  // Pre-populate form with existing review if user has one
  React.useEffect(() => {
    if (product && userInfo) {
      const existingReview = product.reviews?.find(
        (review) => review.name === userInfo.username
      );
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      } else {
        // Reset form if no existing review
        setRating(0);
        setComment("");
      }
    }
  }, [product, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      // Reset form after successful submission
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success(`${qty} ${qty === 1 ? "item" : "items"} added to cart`);
    navigate("/cart");
  };

  // Create array of images (main image + additional images if available)
  const productImages = product?.image ? [product.image] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FaExclamationTriangle className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Error Loading Product
            </h2>
            <p className="text-gray-400 mb-6">
              {error?.data?.message ||
                error.message ||
                "There was an error loading the product. Please try again later."}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-medium"
            >
              <FaArrowLeft className="text-sm" />
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FaBox className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-medium"
            >
              <FaArrowLeft className="text-sm" />
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#50C878] transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm" />
            Back to Home
          </Link>
        </div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative">
              <img
                src={productImages[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl border border-gray-700 shadow-2xl"
              />

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                    product.countInStock === 0
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : product.countInStock < 10
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  <FaWarehouse className="text-xs" />
                  {product.countInStock === 0
                    ? "Out of Stock"
                    : `${product.countInStock} in Stock`}
                </span>
              </div>

              {/* Favorites Button */}
              <div className="absolute top-4 right-4">
                <HeartIcon product={product} />
              </div>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-[#50C878] shadow-lg shadow-[#50C878]/20"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#50C878]/20 text-[#50C878] rounded-full text-sm font-medium border border-[#50C878]/30">
                  <FaTags className="text-xs" />
                  {product.category.name || "Uncategorized"}
                </span>
                {product.brand && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                    <FaStore className="text-xs" />
                    {product.brand}
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                      const starValue = index + 1;
                      const halfStar = product.rating - index === 0.5;
                      const fullStar = product.rating >= starValue;

                      return (
                        <span key={index} className="text-yellow-400">
                          {halfStar ? (
                            <FaStarHalfAlt className="text-xl" />
                          ) : fullStar ? (
                            <FaStar className="text-xl" />
                          ) : (
                            <FaRegStar className="text-xl" />
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-gray-300 font-medium">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">
                  {product.numReviews || 0} review
                  {product.numReviews !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-5xl lg:text-6xl font-bold text-[#50C878]">
                ${product.price?.toFixed(2) || "0.00"}
              </p>
              <p className="text-gray-400 text-sm">
                Free shipping on orders over $50
              </p>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Description</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#50C878]/20 rounded-lg flex items-center justify-center">
                    <FaStore className="text-[#50C878] text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Brand</p>
                    <p className="text-white font-medium">
                      {product.brand || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-blue-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Added</p>
                    <p className="text-white font-medium">
                      {product.createAt
                        ? moment(product.createAt).fromNow()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <FaStar className="text-yellow-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Rating</p>
                    <p className="text-white font-medium">
                      {product.rating?.toFixed(1) || "0.0"} / 5.0
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FaShoppingBag className="text-purple-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Quantity</p>
                    <p className="text-white font-medium">
                      {product.quantity || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaTruck className="text-green-400 text-xl" />
                </div>
                <p className="text-gray-400 text-xs">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaShieldAlt className="text-blue-400 text-xl" />
                </div>
                <p className="text-gray-400 text-xs">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaCheckCircle className="text-purple-400 text-xl" />
                </div>
                <p className="text-gray-400 text-xs">Quality Guaranteed</p>
              </div>
            </div>

            {/* Add to Cart Section */}
            {product.countInStock > 0 ? (
              <div className="space-y-6 p-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Quantity</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Available:</span>
                    <span className="text-white font-medium">
                      {product.countInStock}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="flex-1 p-4 border border-gray-600 rounded-lg bg-[#101011] text-white focus:ring-2 focus:ring-[#50C878] focus:border-[#50C878] transition-all duration-200"
                  >
                    {[...Array(Math.min(product.countInStock, 20))].map(
                      (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    onClick={addToCartHandler}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-[#50C878]/20"
                  >
                    <FaShoppingCart className="text-xl" />
                    Add to Cart
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Total:{" "}
                    <span className="text-white font-semibold">
                      ${(product.price * qty).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl border border-red-500/30 text-center">
                <FaExclamationTriangle className="text-red-400 text-3xl mx-auto mb-3" />
                <p className="text-red-400 font-medium">
                  This product is currently out of stock
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Check back later for availability
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Tabs Section */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            comment={comment}
            setComment={setComment}
            rating={rating}
            setRating={setRating}
            product={product}
            submitHandler={submitHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
