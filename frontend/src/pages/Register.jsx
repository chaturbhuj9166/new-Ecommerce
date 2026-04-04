import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import instance from "../axiosConfig";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ================= HANDLE CHANGE =================
  function handleChange(e) {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "");
    }

    setData({ ...data, [name]: value });
  }

  // ================= REGISTER =================
  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await instance.post("/user/register", data);

      if (res.status === 201) {
        toast.success("✅ Registered successfully");
        navigate("/login"); // 👉 direct login
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Create Account
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          Fill details to register
        </p>

        {/* REGISTER FORM */}
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            name="name"
            value={data.name}
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
          />

          <input
            name="email"
            value={data.email}
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
          />

          <input
            name="phone"
            value={data.phone}
            placeholder="Phone Number"
            maxLength={10}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
          />

          <input
            name="username"
            value={data.username}
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              name="password"
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-black outline-none"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
