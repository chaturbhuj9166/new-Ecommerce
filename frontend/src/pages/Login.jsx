import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

function Login() {
  const { checkIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    await axios.post(
      `${import.meta.env.VITE_BASEURL}/user/login`,
      data,
      { withCredentials: true }
    );

    // 🔥 MOST IMPORTANT FIX
    await checkIsLoggedIn();   // ⬅️ YAHI MISSING THA

    navigate(location.state?.from || "/");
  } catch (error) {
    alert("Invalid email or password");
  }
}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-black outline-none"
          />

          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-black outline-none"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition font-semibold"
          >
            Login
          </button>
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
