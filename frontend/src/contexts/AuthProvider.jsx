/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import instance from "../axiosConfig.js";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 On page refresh
  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  // ✅ CHECK LOGIN (USER)
  async function checkIsLoggedIn() {
    try {
      const response = await instance.get(
        "/check/login?referer=user",
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoggedIn(true);
        setLoggedinUser(response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Normal case: not logged in
        setIsLoggedIn(false);
        setLoggedinUser(null);
      } else {
        console.error("Auth check failed:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  // ✅ LOGOUT (React friendly)
  async function handleLogout(navigate) {
    try {
      const response = await instance.post(
        "/user/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoggedIn(false);
        setLoggedinUser(null);
        navigate("/"); // ✅ React way
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loggedinUser,
        loading,
        checkIsLoggedIn,
        handleLogout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
