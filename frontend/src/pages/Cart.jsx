import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../redux/feauture/cart/cartSlice";
import {
  FaTrash,
  FaShoppingCart,
  FaShoppingBag,
  FaArrowLeft,
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import backendBaseUrl from "../config";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addtoCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  // Calculate totals
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const shipping = totalItems > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#50C878] to-[#45a06a] bg-clip-text text-transparent">
                SHOPPING CART
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Your shopping cart is waiting for amazing products
              </p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="mb-8">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center border border-gray-700">
                  <FaShoppingCart className="text-5xl text-gray-400" />
                </div>
                <h2 className="text-3xl font-semibold text-white mb-4">
                  Your Cart is Empty
                </h2>
                <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                  Looks like you haven't added any products to your cart yet.
                  Start shopping and discover amazing products to add to your
                  cart!
                </p>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#50C878] to-[#45a06a] text-white font-bold rounded-xl hover:from-[#45a06a] hover:to-[#50C878] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaShoppingBag className="text-xl" />
                Start Shopping Now
              </Link>
            </div>
          </div>
        ) : (
          // Cart with Items
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#50C878] to-[#45a06a] bg-clip-text text-transparent">
                SHOPPING CART
              </h1>
              <p className="text-xl text-gray-300">
                Review your items and proceed to checkout
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <FaShoppingCart className="text-[#50C878]" />
                    Cart Items ({totalItems})
                  </h2>

                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 bg-[#101011] rounded-xl border border-gray-700 hover:border-[#50C878] transition-all duration-200"
                      >
                        {/* Product Image */}
                        <div className="min-w-[5rem] w-20 h-20 sm:w-24 sm:h-24">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg border border-gray-600"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item._id}`}
                            className="text-[#50C878] font-semibold text-lg hover:text-[#45a06a] transition-colors block mb-2"
                          >
                            {item.name}
                          </Link>
                          <div className="text-gray-300 mb-2">{item.brand}</div>
                          <div className="text-white font-bold text-lg">
                            ${item.price}
                          </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="w-24">
                          <select
                            className="w-full p-2 border border-gray-600 rounded-lg text-white bg-[#101011] focus:outline-none focus:border-[#50C878] focus:ring-2 focus:ring-[#50C878]/20 transition-all duration-200"
                            value={item.qty}
                            onChange={(e) =>
                              addtoCartHandler(item, Number(e.target.value))
                            }
                          >
                            {[...Array(item.countInStock || 0).keys()].map(
                              (x) => (
                                <option value={x + 1} key={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[5rem]">
                          <div className="text-white font-bold text-lg">
                            ${(item.qty * item.price).toFixed(2)}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                          title="Remove item"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-96">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 sticky top-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaCheckCircle className="text-[#50C878]" />
                    Order Summary
                  </h3>

                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">
                        Subtotal ({totalItems} items)
                      </span>
                      <span className="text-white font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">Shipping</span>
                      <span className="text-white font-semibold">
                        {shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-t border-gray-600">
                      <span className="text-white font-bold text-lg">
                        Total
                      </span>
                      <span className="text-[#50C878] font-bold text-2xl">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    className="w-full bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaCreditCard className="text-lg" />
                      Proceed to Checkout
                    </div>
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    to="/shop"
                    className="w-full mt-4 border-2 border-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-xl hover:border-[#50C878] hover:text-[#50C878] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaArrowLeft className="text-lg" />
                    Continue Shopping
                  </Link>

                  {/* Trust Indicators */}
                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <FaTruck className="text-[#50C878]" />
                        <span>Free Shipping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-[#50C878]" />
                        <span>Secure Checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
