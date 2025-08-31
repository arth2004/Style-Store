import React, { useState } from "react";
import {
  useGetTopProductsQuery,
  useGetFilteredProductsQuery,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import { Link } from "react-router";
import Rating from "./Rating";
import SmallProduct from "./SmallProducts";
import {
  FaStar,
  FaEdit,
  FaComments,
  FaBox,
  FaUser,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaShoppingBag,
  FaArrowRight,
  FaRegStar,
  FaStarHalfAlt,
  FaPencilAlt,
  FaCheck,
} from "react-icons/fa";
import moment from "moment";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  comment,
  setComment,
  rating,
  setRating,
  product,
  submitHandler,
}) => {
  const { data: topProducts, isLoading: isLoadingTop } =
    useGetTopProductsQuery();

  // Get related products based on current product's category
  const { data: relatedProducts, isLoading: isLoadingRelated } =
    useGetFilteredProductsQuery(
      { checked: [product?.category], radio: [] },
      { skip: !product?.category }
    );

  const [activeTab, setActiveTab] = useState(1);

  if (isLoadingTop) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  // Filter out the current product from related products
  const filteredRelatedProducts =
    relatedProducts?.filter(
      (relatedProduct) => relatedProduct._id !== product?._id
    ) || [];

  // Check if user has already reviewed this product
  const userReview = product?.reviews?.find(
    (review) => review.name === userInfo?.username
  );

  const tabs = [
    {
      id: 1,
      title: "Write Review",
      icon: FaEdit,
      description: userReview
        ? "Update your existing review"
        : "Share your experience with this product",
    },
    {
      id: 2,
      title: "All Reviews",
      icon: FaComments,
      description: `Read ${product?.reviews?.length || 0} customer reviews`,
    },
    {
      id: 3,
      title: "Related Products",
      icon: FaBox,
      description: "Discover similar products you might like",
    },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 text-lg font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? "text-[#50C878] border-[#50C878] bg-[#50C878]/5"
                : "text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-800/50"
            }`}
          >
            <tab.icon className="text-xl" />
            <div className="text-left">
              <div className="font-semibold">{tab.title}</div>
              <div className="text-sm font-normal opacity-75">
                {tab.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Tab 1: Write Review */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {userReview ? "Update Your Review" : "Write Your Review"}
              </h2>
              <p className="text-gray-400">
                {userReview
                  ? "Modify your existing review or add new thoughts"
                  : "Help other customers by sharing your experience"}
              </p>
            </div>

            {userInfo ? (
              <div className="max-w-2xl mx-auto">
                {/* Show existing review if user has one */}
                {userReview && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-[#50C878]/10 to-[#45a06a]/10 rounded-2xl border border-[#50C878]/30">
                    <div className="flex items-center gap-3 mb-4">
                      <FaCheck className="text-[#50C878] text-xl" />
                      <h3 className="text-lg font-semibold text-white">
                        Your Current Review
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Rating:</span>
                        <Rating value={userReview.rating} size="sm" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Comment:</span>
                        <p className="text-white mt-1">{userReview.comment}</p>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Posted:{" "}
                        {moment(userReview.createdAt).format("MMM DD, YYYY")}
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                  {/* Rating Selection */}
                  <div className="space-y-3">
                    <label
                      htmlFor="rating"
                      className="block text-lg font-semibold text-white"
                    >
                      Your Rating
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {[5, 4, 3, 2, 1].map((starValue) => (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setRating(starValue)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            rating === starValue
                              ? "border-[#50C878] bg-[#50C878]/20 text-[#50C878]"
                              : "border-gray-600 bg-[#101011] text-gray-400 hover:border-gray-500 hover:bg-gray-800"
                          }`}
                        >
                          <div className="text-center">
                            <div className="flex justify-center mb-2">
                              {[...Array(5)].map((_, index) => (
                                <span key={index} className="text-lg">
                                  {index < starValue ? (
                                    <FaStar className="text-yellow-400" />
                                  ) : (
                                    <FaRegStar className="text-gray-500" />
                                  )}
                                </span>
                              ))}
                            </div>
                            <div className="text-sm font-medium">
                              {starValue === 5 && "Exceptional"}
                              {starValue === 4 && "Excellent"}
                              {starValue === 3 && "Great"}
                              {starValue === 2 && "Decent"}
                              {starValue === 1 && "Poor"}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-3">
                    <label
                      htmlFor="comment"
                      className="block text-lg font-semibold text-white"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      rows="5"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-4 border border-gray-600 rounded-xl bg-[#101011] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#50C878] focus:border-[#50C878] transition-all duration-200 resize-none"
                      placeholder="Share your thoughts about this product..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      loadingProductReview || !rating || !comment.trim()
                    }
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#50C878] text-white rounded-xl hover:bg-[#45a06a] transition-all duration-200 font-semibold text-lg disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingProductReview ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {userReview
                          ? "Updating Review..."
                          : "Submitting Review..."}
                      </>
                    ) : (
                      <>
                        <FaEdit className="text-xl" />
                        {userReview ? "Update Review" : "Submit Review"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FaUser className="text-blue-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Sign in to Write a Review
                </h3>
                <p className="text-gray-400 mb-6">
                  Join our community and share your experience with this product
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-medium"
                >
                  Sign In
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: All Reviews */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Customer Reviews
              </h2>
              <p className="text-gray-400">
                {product?.reviews?.length || 0} review
                {(product?.reviews?.length || 0) !== 1 ? "s" : ""} from verified
                customers
              </p>
            </div>

            {!product?.reviews || product.reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FaComments className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  No Reviews Yet
                </h3>
                <p className="text-gray-400">
                  Be the first to review this product!
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className={`bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border p-6 hover:border-gray-600 transition-all duration-200 ${
                      review.name === userInfo?.username
                        ? "border-[#50C878]/50 bg-[#50C878]/5"
                        : "border-gray-700"
                    }`}
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            review.name === userInfo?.username
                              ? "bg-[#50C878]/20"
                              : "bg-[#50C878]/20"
                          }`}
                        >
                          <FaUser className="text-[#50C878] text-lg" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-semibold">
                              {review.name}
                            </h4>
                            {review.name === userInfo?.username && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#50C878]/20 text-[#50C878] rounded-full text-xs font-medium border border-[#50C878]/30">
                                <FaCheck className="text-xs" />
                                You
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Rating value={review.rating} />
                            <span className="text-gray-400 text-sm">
                              {moment(review.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {moment(review.createdAt).format("MMM DD, YYYY")}
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="pl-15">
                      <p className="text-gray-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Related Products */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Related Products
              </h2>
              <p className="text-gray-400">
                Discover similar products you might like
              </p>
            </div>

            {isLoadingRelated ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : filteredRelatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FaBox className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  No Related Products Found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try exploring other categories for similar items
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#50C878] text-white rounded-lg hover:bg-[#45a06a] transition-colors font-medium"
                >
                  <FaShoppingBag className="text-sm" />
                  Browse Shop
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">
                    Found {filteredRelatedProducts.length} related product
                    {filteredRelatedProducts.length !== 1 ? "s" : ""}
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-[#50C878] hover:text-[#45a06a] transition-colors font-medium"
                  >
                    View All Products
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredRelatedProducts
                    .slice(0, 10)
                    .map((relatedProduct) => (
                      <div key={relatedProduct._id} className="w-full">
                        <SmallProduct product={relatedProduct} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
