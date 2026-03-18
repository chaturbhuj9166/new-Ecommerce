/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import instance from "../axiosConfig";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check login on page load
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await instance.get("/check/login", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setIsLoggedIn(true);
          setUser(res.data);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // ✅ Login state update
  const loginUser = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // ✅ Logout
  const handleLogout = async (navigate) => {
    try {
      await instance.post(
        "/user/logout",
        {},
        { withCredentials: true }
      );

      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, loading, loginUser, handleLogout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
