import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { GoogleLogin } from "@react-oauth/google";
import instance from "../axiosConfig";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const { checkIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // 🔥 loader
  const [showPassword, setShowPassword] = useState(false); // 👁 eye icon

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  // ✅ NORMAL LOGIN
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BASEURL}/user/login`,
        data,
        { withCredentials: true }
      );

      await checkIsLoggedIn();
      toast.success("✅ Login successful");

      setTimeout(() => {
        setLoading(false);
        navigate(location.state?.from || "/");
      }, 2000);
    } catch {
      setLoading(false);
      toast.error("❌ Invalid email or password");
    }
  }

  // ✅ GOOGLE LOGIN
  async function handleGoogleSuccess(credentialResponse) {
    try {
      setLoading(true);

      console.log("google credential:", credentialResponse);
      await instance.post("/user/google-login", {
        token: credentialResponse.credential,
      });

      toast.success("🎉 Google login successful");
      await checkIsLoggedIn();

      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 2000);
    } catch {
      setLoading(false);
      toast.error("❌ Google login failed");
    }
  }

  function handleGoogleError() {
    toast.error("❌ Google Login Failed");
  }

  // 🔥 FULL SCREEN LOADER
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold">Logging you in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full border rounded-md px-4 py-2
                       focus:ring-2 focus:ring-black outline-none"
          />

          {/* PASSWORD WITH EYE ICON */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full border rounded-md px-4 py-2 pr-10
                         focus:ring-2 focus:ring-black outline-none"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         cursor-pointer text-gray-600 hover:text-black"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md
                       hover:bg-gray-800 transition font-semibold"
          >
            Login
          </button>

          {/* GOOGLE LOGIN */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </form>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
