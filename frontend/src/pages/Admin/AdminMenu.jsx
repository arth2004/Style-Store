import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <button
        className={`fixed z-50 p-3 bg-[#151515] rounded-lg transition-all duration-300 ${
          isMenuOpen ? "top-2 right-2" : "top-5 right-5"
        }`}
        onClick={toggleMenu}
        aria-label="Toggle Admin Menu"
      >
        {isMenuOpen ? (
          <FaTimes color="white" size={20} />
        ) : (
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-200"></span>
            <span className="block w-6 h-0.5 bg-gray-200"></span>
            <span className="block w-6 h-0.5 bg-gray-200"></span>
          </div>
        )}
      </button>

      {isMenuOpen && (
        <section className="fixed top-5 right-5 z-40 bg-[#151515] p-5 rounded-lg shadow-lg w-60">
          <ul className="space-y-4">
            {[
              { path: "/admin/dashboard", label: "Admin Dashboard" },
              { path: "/admin/categorylist", label: "Create Category" },
              { path: "/admin/productlist", label: "Create Product" },
              { path: "/admin/allproductslist", label: "All Products" },
              { path: "/admin/userlist", label: "Manage Users" },
              { path: "/admin/orderlist", label: "Manage Orders" },
            ].map((link) => (
              <li key={link.path}> 
                <NavLink
                  to={link.path}
                  className="block py-2 px-3 rounded-md text-white hover:bg-[#2E2D2D] transition"
                  style={({ isActive }) => ({
                    color: isActive ? "greenyellow" : "white",
                  })}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
