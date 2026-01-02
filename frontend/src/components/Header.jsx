import { Link, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import {
  FaCartPlus,
  FaHeart,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthProvider";
import { useCart } from "../contexts/CartProvider";

function Header() {
  const navigate = useNavigate();

  // ✅ Correct auth destructuring (ONCE)
  const { isLoggedIn, handleLogout } = useAuth();
  const { cartItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-700 transition"
        >
          🛍️ E-Store
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full focus-within:ring-2 ring-indigo-600 transition">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm w-48 text-slate-700"
          />
        </div>

        {/* RIGHT MENU */}
        <nav className="flex items-center gap-8 text-sm font-semibold text-slate-700">

          {/* WISHLIST */}
          <Link
            to="/Wishlist"
            className="flex items-center gap-2 hover:text-rose-500 transition"
          >
            <FaHeart className="text-xl" />
            <span className="hidden sm:inline">Wishlist</span>
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 hover:text-indigo-600 transition"
          >
            <FaCartPlus className="text-xl" />
            <span className="hidden sm:inline">Cart</span>

            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs px-2 rounded-full animate-pulse">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* ADMIN */}
          <Link
            to="/admin/login"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
          >
            <FaUserShield className="text-xl" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* AUTH */}
          {isLoggedIn ? (
            <button
              onClick={() => handleLogout(navigate)}   // ✅ correct
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-full transition"
            >
              Logout <IoMdLogOut />
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
            >
              <FaUserCircle />
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
