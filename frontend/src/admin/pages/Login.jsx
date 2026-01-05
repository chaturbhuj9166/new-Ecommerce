import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../axiosConfig";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function AdminLogin() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);        // 🔥 login loader
  const [showPassword, setShowPassword] = useState(false); // 👁 eye icon

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await instance.post(
        "/admin/login",
        data,
        { withCredentials: true }
      );

      toast.success("Admin login successful 🎉");

      setTimeout(() => {
        setLoading(false);
        navigate("/admin/dashboard");
      }, 400);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Admin Login
          </h2>

          <button
            onClick={() => navigate("/")}
            className="text-sm px-3 py-2 rounded-lg border border-green-600
                       text-green-600 hover:bg-green-50 transition"
          >
            ← Back to Home
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-4 py-2
                         focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* PASSWORD WITH EYE ICON */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={handleChange}
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
          </div>

          {/* LOGIN BUTTON WITH LOADER */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold
              flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white
                                 border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
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

export default AdminLogin;
