import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/feauture/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserPlus,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      toast.success("Login successful! Welcome back!");
      navigate(redirect);
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FaSignInAlt className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-lg">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Form */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <form onSubmit={submitHandler} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.email
                          ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                          : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                      } text-white placeholder-gray-400`}
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                      <FaCheckCircle className="text-xs" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.password
                          ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                          : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                      } text-white placeholder-gray-400`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                      <FaCheckCircle className="text-xs" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  disabled={isLoading || isSubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      Sign In
                    </>
                  )}
                </button>

                {isLoading && <Loader />}
              </form>

              {/* Register Link */}
              <div className="mt-8 pt-6 border-t border-gray-600 text-center">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to={
                      redirect ? `/register?redirect=${redirect}` : "/register"
                    }
                    className="text-[#50C878] hover:text-[#45a06a] font-semibold transition-colors hover:underline"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-[#50C878]" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#50C878]" />
                  <span>Data Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#50C878] to-[#45a06a] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full flex items-center justify-center p-16">
            <div className="text-center text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Welcome to StyleStore
                </h2>
                <p className="text-lg text-white/90 mb-6">
                  Your one-stop destination for amazing products and exceptional
                  shopping experiences
                </p>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-xl" />
                    <span>Secure & Fast Checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-xl" />
                    <span>24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-xl" />
                    <span>Exclusive Member Benefits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
