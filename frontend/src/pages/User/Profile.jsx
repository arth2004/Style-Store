import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/feauture/auth/authSlice";
import { Link } from "react-router";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import AdminMenu from "../Admin/AdminMenu";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaReceipt,
  FaShieldAlt,
  FaCheckCircle,
  FaUserEdit,
} from "react-icons/fa";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");

      // Clear password fields after successful update
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Menu */}
          <div className="absolute">
          <AdminMenu />
          </div>

          {/* Profile Form */}
          <div className="flex-1">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="bg-gradient-to-br from-[#50C878] to-[#45a06a] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FaUserEdit className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Update Profile
              </h1>
              <p className="text-gray-400 text-lg">
                Keep your account information up to date
              </p>
            </div>

            {/* Profile Form */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-gray-700 shadow-2xl max-w-2xl mx-auto">
              <form onSubmit={submitHandler} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className=" text-white font-semibold mb-3 flex items-center gap-2">
                    <FaUser className="text-[#50C878]" />
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.username
                        ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                        : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                    } text-white placeholder-gray-400`}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      clearError("username");
                    }}
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <FaEnvelope className="text-[#50C878]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.email
                        ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                        : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                    } text-white placeholder-gray-400`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <FaLock className="text-[#50C878]" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password (optional)"
                      className={`w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.password
                          ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                          : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                      } text-white placeholder-gray-400`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError("password");
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <FaLock className="text-[#50C878]" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className={`w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.confirmPassword
                          ? "border-red-500 bg-red-900/20 focus:ring-red-500"
                          : "border-gray-600 bg-[#101011] focus:border-[#50C878] focus:ring-[#50C878]/20"
                      } text-white placeholder-gray-400`}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearError("confirmPassword");
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loadingUpdateProfile}
                    className="flex-1 bg-gradient-to-r from-[#50C878] to-[#45a06a] hover:from-[#45a06a] hover:to-[#50C878] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loadingUpdateProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Update Profile
                      </>
                    )}
                  </button>

                  <Link
                    to="/user-orders"
                    className="flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] hover:from-[#2a2a2a] hover:to-[#1a1a1a] text-white font-bold py-4 px-6 rounded-xl border border-gray-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaReceipt />
                    My Orders
                  </Link>
                </div>

                {/* Loading Indicator */}
                {loadingUpdateProfile && (
                  <div className="text-center py-4">
                    <Loader />
                  </div>
                )}
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 border border-gray-700 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaShieldAlt className="text-[#50C878]" />
                  Account Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#50C878]" />
                    <span>Secure Profile Updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#50C878]" />
                    <span>Password Protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#50C878]" />
                    <span>Data Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#50C878]" />
                    <span>24/7 Security</span>
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

export default Profile;
