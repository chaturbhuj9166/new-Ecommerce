import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRouters = () => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    checkForLogin();
  }, []);

  const checkForLogin = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASEURL}/check/login?referer=admin`,
        { withCredentials: true }
      );

      // ✅ backend se success aaya
      if (res.status === 200) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } catch (error) {
      setIsAllowed(false);
    } finally {
      setLoading(false);
    }
  };

  // ⏳ jab tak check ho raha
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Checking admin access...</p>
      </div>
    );
  }

  // ❌ admin nahi hai → login pe bhejo
  if (!isAllowed) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ admin hai → route allow
  return <Outlet />;
};

export default ProtectedRouters;
