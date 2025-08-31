import { useDispatch, useSelector } from "react-redux";
import ProgressSteps from "../../components/ProgressSteps";
import { Link, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearCartItems } from "../../redux/feauture/cart/cartSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import backendBaseUrl from "../../config";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
  FaReceipt,
} from "react-icons/fa";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      console.log("Order Created:", res);
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Something went wrong";
      toast.error(message);
    }
  };

  if (cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <ProgressSteps step1 step2 step3 />
          <div className="text-center py-20">
            <Message>Your cart is empty</Message>
            <Link
              to="/shop"
              className="inline-block mt-4 bg-[#50C878] text-white px-6 py-3 rounded-lg hover:bg-[#45a06a] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <ProgressSteps step1 step2 step3 />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <FaReceipt className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Review Your Order
          </h1>
          <p className="text-gray-400 text-lg">
            Please review your order details before placing your order
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Details - Left Side */}
          <div className="flex-1">
            {/* Products Table */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaShoppingCart className="text-[#50C878]" />
                Order Items ({cart.cartItems.length})
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-gray-300 font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {cart.cartItems.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#101011] transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                            />
                            <div>
                              <Link
                                to={`/product/${item._id}`}
                                className="text-[#50C878] hover:text-[#45a06a] font-semibold transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="text-gray-400 text-sm">
                                {item.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-white">{item.qty}</td>
                        <td className="px-4 py-4 text-white">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-white font-semibold">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#50C878]" />
                Shipping Address
              </h2>
              <div className="bg-[#101011] rounded-xl p-4 border border-gray-600">
                <p className="text-white mb-2">
                  <strong>Address:</strong> {cart.shippingAddress.address}
                </p>
                <p className="text-white mb-2">
                  <strong>City:</strong> {cart.shippingAddress.city}
                </p>
                <p className="text-white mb-2">
                  <strong>Postal Code:</strong>{" "}
                  {cart.shippingAddress.postalCode}
                </p>
                <p className="text-white">
                  <strong>Country:</strong> {cart.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaCreditCard className="text-[#50C878]" />
                Payment Method
              </h2>
              <div className="bg-[#101011] rounded-xl p-4 border border-gray-600">
                <p className="text-white">
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:w-96">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl sticky top-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaCheckCircle className="text-[#50C878]" />
                Order Summary
              </h3>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">
                    Items (
                    {cart.cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </span>
                  <span className="text-white font-semibold">
                    ${(Number(cart.itemsPrice) || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white font-semibold">
                    ${(Number(cart.shippingPrice) || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Tax</span>
                  <span className="text-white font-semibold">
                    ${(Number(cart.taxPrice) || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-gray-600">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-[#50C878] font-bold text-2xl">
                    ${(Number(cart.totalPrice) || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6">
                  <Message variant="danger">{error.data.message}</Message>
                </div>
              )}

              {/* Place Order Button */}
              <button
                type="button"
                className="w-full bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Place Order
                  </>
                )}
              </button>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-600">
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-[#50C878]" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTruck className="text-[#50C878]" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-[#50C878]" />
                    <span>Order Protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-gray-700 text-center">
              <Loader />
              <p className="text-white mt-4 text-lg">
                Processing your order...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
