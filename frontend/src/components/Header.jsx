import { Link, useNavigate } from "react-router-dom";
import { IoMdLogOut, IoMdMenu, IoMdClose } from "react-icons/io";
import {
  FaCartPlus,
  FaHeart,
  FaUserCircle,
  FaUserShield,
  FaBoxOpen,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthProvider";
import { useCart } from "../contexts/CartProvider";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, handleLogout, loading } = useAuth();
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutUser = async () => {
    await handleLogout(navigate);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent"
        >
          🛍️ E-Store
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">

          <Link to="/wishlist" className="flex items-center gap-2 hover:text-rose-500">
            <FaHeart /> Wishlist
          </Link>

          <Link to="/cart" className="relative flex items-center gap-2 hover:text-indigo-600">
            <FaCartPlus /> Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs px-2 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* ✅ Orders (Only if Logged In) */}
          {!loading && isLoggedIn && (
            <Link
              to="/my-orders"
              className="flex items-center gap-2 hover:text-green-600"
            >
              <FaBoxOpen /> Orders
            </Link>
          )}

          <Link to="/admin/login" className="flex items-center gap-2 text-blue-600">
            <FaUserShield /> Admin
          </Link>

          {/* LOGIN / LOGOUT */}
          {!loading && (
            isLoggedIn ? (
              <button
                onClick={logoutUser}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-full"
              >
                Logout <IoMdLogOut />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full"
              >
                <FaUserCircle /> Login
              </Link>
            )
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4 bg-white shadow-md">

          <Link onClick={() => setMenuOpen(false)} to="/wishlist" className="flex items-center gap-3">
            <FaHeart /> Wishlist
          </Link>

          <Link onClick={() => setMenuOpen(false)} to="/cart" className="flex items-center gap-3">
            <FaCartPlus /> Cart ({cartItems.length})
          </Link>

          {/* ✅ Orders Mobile */}
          {!loading && isLoggedIn && (
            <Link
              onClick={() => setMenuOpen(false)}
              to="/orders"
              className="flex items-center gap-3"
            >
              <FaBoxOpen /> Orders
            </Link>
          )}

          <Link onClick={() => setMenuOpen(false)} to="/admin/login" className="flex items-center gap-3">
            <FaUserShield /> Admin
          </Link>

          {!loading && (
            isLoggedIn ? (
              <button
                onClick={logoutUser}
                className="flex items-center gap-3 text-red-600"
              >
                <IoMdLogOut /> Logout
              </button>
            ) : (
              <Link
                onClick={() => setMenuOpen(false)}
                to="/login"
                className="flex items-center gap-3 text-indigo-600"
              >
                <FaUserCircle /> Login
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
