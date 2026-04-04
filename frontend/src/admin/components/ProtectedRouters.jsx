import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import instance from "../../axiosConfig";

const ProtectedRouters = () => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    checkForLogin();
  }, []);

  const checkForLogin = async () => {
    try {
      const res = await instance.get("/check/login?referer=admin");

      if (res.status === 200) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } catch {
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
