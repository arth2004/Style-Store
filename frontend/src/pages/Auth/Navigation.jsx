import React, { useEffect } from "react";
import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/feauture/auth/authSlice";
import FavouritesCount from "../Products/FavouritesCount";
import CartCount from "../CartCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showSidebar, setShowsidebar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setDropdownOpen(false);
  }, [userInfo]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  const toggleSidebar = () => {
    setShowsidebar(!showSidebar);
  };
  const closeSidebar = () => {
    setShowsidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{ zIndex: 999 }}
        className={`fixed top-0 left-0 h-screen bg-black text-white transition-all duration-300 ease-in-out ${
          showSidebar ? "flex" : "hidden"
        } flex-col justify-between py-6 px-4 xl:flex xl:w-[7%] xl:hover:w-[9%]`}
        id="navigation-container"
      >
        <div className="flex flex-col justify-center space-y-4">
          <Link
            to="/"
            className="flex items-center gap-3 mt-10 group transition-transform hover:translate-x-2"
            onClick={closeSidebar}
          >
            <AiOutlineHome
              className="text-xl group-hover:text-gray-300 transition-colors duration-200"
              size={26}
            />
            <span className="hidden nav-item-name group-hover:inline-block">
              HOME
            </span>{" "}
          </Link>
          <Link
            to="/shop"
            className="flex items-center gap-3 mt-10 group transition-transform hover:translate-x-2"
            onClick={closeSidebar}
          >
            <AiOutlineShopping
              className="text-xl group-hover:text-gray-300 transition-colors duration-200"
              size={26}
            />
            <span className="hidden nav-item-name group-hover:inline-block">
              SHOP
            </span>{" "}
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-3 mt-10 group hover:translate-x-2 transition-transform"
            onClick={closeSidebar}
          >
            <div className="relative">
              <AiOutlineShoppingCart
                className="text-xl group-hover:text-gray-300 transition-colors duration-200"
                size={26}
              />
              <CartCount />
            </div>
            <span className="hidden nav-item-name group-hover:inline-block">
              Cart
            </span>
          </Link>

          <Link
            to="/favorite"
            className="flex items-center gap-3 mt-10 group hover:translate-x-2 transition-transform"
            onClick={closeSidebar}
          >
            <div className="relative">
              <FaHeart
                className="text-xl group-hover:text-gray-300 transition-colors duration-200"
                size={20}
              />
              <FavouritesCount />
            </div>
            <span className="hidden nav-item-name group-hover:inline-block">
              Favorites
            </span>
          </Link>
        </div>

        <div className="relative">
          {userInfo && (
            <button
              onClick={toggleDropdown}
              className="right-0 flex items-center gap-2 px-1 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors duration-200"
            >
              <span className="text-white font-semibold ">
                {userInfo?.username}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
          {dropdownOpen && userInfo && (
            <ul
              className={`absolute left-0 origin-top-left bg-gray-800 shadow-lg rounded-md text-sm text-gray-50 w-28 overflow-hidden transition-all duration-300 ${
                dropdownOpen
                  ? "max-h-[500px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
              } ${userInfo?.isAdmin ? "top-[-320px]" : "top-[-100px]"}`}
            >
              {userInfo.isAdmin && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={toggleDropdown}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={toggleDropdown}
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/categorylist"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={toggleDropdown}
                    >
                      Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={toggleDropdown}
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-2 hover:bg-gray-700"
                      onClick={toggleDropdown}
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={toggleDropdown}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}

          {!userInfo && (
            <ul>
              <li>
                <Link
                  to="/login"
                  className="flex items-center mt-5 gap-2 hover:text-white text-gray-400 transition-transform transform hover:translate-x-2"
                  onClick={closeSidebar}
                >
                  <AiOutlineLogin size={22} />
                  <span className="hidden nav-item-name group-hover:inline-block">
                    Login
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                  onClick={closeSidebar}
                >
                  <AiOutlineUserAdd size={26} />
                  <span className="hidden nav-item-name">REGISTER</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      {/* Menu Button */}
      <button
        className="lg:hidden xl:hidden fixed top-4 right-4 z-[1000] p-2 bg-gray-800 text-white rounded-md"
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={24} />
      </button>
    </>
  );
};

export default Navigation;
