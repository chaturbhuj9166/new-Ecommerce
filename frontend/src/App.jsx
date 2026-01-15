import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthProvider from "./contexts/AuthProvider.jsx";
import { CartProvider } from "./contexts/CartProvider.jsx";

// Layouts
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// USER PAGES
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";

// ADMIN PAGES
import AdminLogin from "./admin/pages/Login.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Manage from "./admin/pages/Manage.jsx";
import AddProduct from "./admin/pages/AddProduct.jsx";
import AddCategory from "./admin/pages/AddCategory.jsx";
import AddCoupon from "./admin/pages/AddCoupon.jsx";
import AllCoupons from "./admin/pages/AllCoupon.jsx";
import EditCoupon from "./admin/pages/EditCoupon.jsx";
import EditProduct from "./admin/pages/EditProduct.jsx";
import Management from "./admin/pages/Management.jsx";

import ProtectedRouters from "./admin/components/ProtectedRouters.jsx";
import AIChatBox from "./components/AiChatBox.jsx";

const router = createBrowserRouter([
  /* ================= USER ROUTES ================= */
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "cart", element: <Cart /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "product/:slug", element: <SingleProduct /> },
    ],
  },

  /* ================= ADMIN ROUTES ================= */
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      // ✅ Admin Login (no protection)
      { path: "login", element: <AdminLogin /> },

      // 🔐 Protected Admin Pages
      {
        element: <ProtectedRouters />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "manage", element: <Manage /> },
          { path: "product/add", element: <AddProduct /> },
          { path: "category/add", element: <AddCategory /> },

          { path: "coupons", element: <AllCoupons /> },
          { path: "coupons/add", element: <AddCoupon /> },
          { path: "coupons/edit/:id", element: <EditCoupon /> },

        { path: "edit-product/:id", element: <EditProduct /> },
        { path: "management", element: <Management /> },



        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <AIChatBox />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
