import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  savePaymentMethod,
  saveShippingAddress,
} from "../../redux/feauture/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import {
  FaMapMarkerAlt,
  FaCity,
  FaMailchimp,
  FaGlobe,
  FaCreditCard,
  FaPaypal,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
    }

    if (!postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    if (!country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate processing time for better UX
    setTimeout(() => {
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      dispatch(savePaymentMethod(paymentMethod));
      navigate("/placeorder");
    }, 500);
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  // Calculate order summary
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <ProgressSteps step1 step2 />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Shipping Form */}
          <div className="flex-1 max-w-2xl">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-gray-700 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FaTruck className="text-3xl text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Shipping Information
                </h1>
                <p className="text-gray-400 text-lg">
                  Enter your delivery details to continue
                </p>
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#50C878]" />
                    Street Address
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.address
                        ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                        : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                    } text-white placeholder-gray-400`}
                    placeholder="Enter your street address"
                    value={address}
                    required
                    onChange={(e) => {
                      setAddress(e.target.value);
                      clearError("address");
                    }}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                      <FaCheckCircle className="text-xs" />
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City Field */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <FaCity className="text-[#50C878]" />
                    City
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.city
                        ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                        : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                    } text-white placeholder-gray-400`}
                    placeholder="Enter your city"
                    value={city}
                    required
                    onChange={(e) => {
                      setCity(e.target.value);
                      clearError("city");
                    }}
                  />
                  {errors.city && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                      <FaCheckCircle className="text-xs" />
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Postal Code Field */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <FaMailchimp className="text-[#50C878]" />
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.postalCode
                        ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                        : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                    } text-white placeholder-gray-400`}
                    placeholder="Enter your postal code"
                    value={postalCode}
                    required
                    onChange={(e) => {
                      setPostalCode(e.target.value);
                      clearError("postalCode");
                    }}
                  />
                  {errors.postalCode && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                      <FaCheckCircle className="text-xs" />
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                {/* Country Field */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <FaGlobe className="text-[#50C878]" />
                    Country
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.country
                        ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                        : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                    } text-white placeholder-gray-400`}
                    placeholder="Enter your country"
                    value={country}
                    required
                    onChange={(e) => {
                      setCountry(e.target.value);
                      clearError("country");
                    }}
                  />
                  {errors.country && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                      <FaCheckCircle className="text-xs" />
                      {errors.country}
                    </p>
                  )}
                </div>

                {/* Payment Method Selection */}
                <div className="bg-[#101011] rounded-xl p-6 border border-gray-600">
                  <label className="text-lg font-semibold text-white mb-4 block">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-600 rounded-lg hover:border-[#50C878] transition-colors cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio text-[#50C878] focus:ring-[#50C878]"
                        name="paymentMethod"
                        value="PayPal"
                        checked={paymentMethod === "PayPal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="ml-4 flex items-center gap-3">
                        <FaPaypal className="text-2xl text-[#50C878]" />
                        <div>
                          <span className="font-semibold text-white">
                            PayPal
                          </span>
                          <p className="text-sm text-gray-400">
                            Pay with PayPal or Credit Card
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Review
                      <FaArrowRight className="text-lg" />
                    </>
                  )}
                </button>
              </form>
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
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
                  </span>
                  <span className="text-white font-semibold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white font-semibold">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-gray-600">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-[#50C878] font-bold text-2xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Indicators */}
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
                  <FaCheckCircle className="text-[#50C878]" />
                  <span>Order Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
