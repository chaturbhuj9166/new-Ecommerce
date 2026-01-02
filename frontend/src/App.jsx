import { createBrowserRouter, RouterProvider } from "react-router-dom";
import First from "./pages/First.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import AuthProvider from "./contexts/AuthProvider.jsx";
import AdminHome from "./admin/pages/Home.jsx";
import AdminLogin from "./admin/pages/Login.jsx";
import AddProduct from "./admin/pages/AddProduct.jsx";
import ProtectedRouters from "./admin/components/ProtectedRouters.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";
import Cart from "./pages/Cart.jsx";
import {CartProvider} from "./contexts/CartProvider.jsx";
import CreateCoupon from "./admin/pages/AddCoupon.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Manage from "./admin/pages/Manage.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import AddCoupon from "./admin/pages/AddCoupon.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
  
        <First />
    
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "cart", element: <Cart /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "register", element: <Register /> },
      { path: "product/:slug", element: <SingleProduct /> },

      { path: "admin/login", element: <AdminLogin /> },
      { path: "admin/home", element: <AdminHome /> },

      {
        path: "admin/AddProduct",
        element: <AddProduct />,
      },
      {
        path: "admin/Manage",
        element: <Manage />,
      },
      {
        path: "admin/AddCoupon",
        element: <AddCoupon/>,
      },
      {
        path: "admin/Dashboard",
        element: <Dashboard />,
      },
      
      {
        path: "admin/product/add",
        element: (
          <ProtectedRouters>
            <AddProduct />
          </ProtectedRouters>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
      
    </AuthProvider>
  );
}

export default App;