import { createContext, useContext, useEffect, useState } from "react";
import instance from "../axiosConfig";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 check login (reload pe)
  const checkIsLoggedIn = async () => {
    try {
      const res = await instance.get("/check/login?referer=user");

      if (res.data.loggedIn) {
        setIsLoggedIn(true);
        setUser(res.data);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkIsLoggedIn();
      setLoading(false);
    };
    init();
  }, []);

  // 🔥 MAIN FIX
  const loginUser = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = async (navigate) => {
    await instance.post("/user/logout");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        checkIsLoggedIn,
        loginUser,
        handleLogout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
