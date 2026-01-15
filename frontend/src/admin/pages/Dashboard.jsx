import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../axiosConfig";
import { toast } from "react-toastify";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD STATS ================= */
  const fetchStats = async () => {
    try {
      const res = await instance.get(
        "/admin/dashboard-stats",
        { withCredentials: true }
      );
      setStats(res.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await instance.post(
        "/admin/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Admin logged out successfully 👋");
      setTimeout(() => {
        navigate("/");
      }, 400);
    } catch {
      toast.error("Logout failed");
    }
  };

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-700 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-extrabold tracking-widest text-center mb-8">
          ADMIN
        </h2>

        <ul className="flex flex-col gap-3">
          <li>
            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 rounded-lg bg-white/20"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/admin/manage"
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Manage Products
            </Link>
          </li>

          <li>
            <Link
              to="/admin/category/add"
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Add Category
            </Link>
          </li>

          <li>
            <Link
              to="/admin/management"
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Management
            </Link>
          </li>

          <li>
            <Link
              to="/admin/coupons/add"
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Create Coupon
            </Link>
          </li>

          <li>
            <Link
              to="/admin/coupons"
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              All Coupons
            </Link>
          </li>

       

        </ul>

        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-red-500 hover:bg-red-600 transition py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of platform data
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-sm text-slate-500">
              Total Users
            </h3>
            <p className="text-3xl font-extrabold mt-2 text-indigo-600">
              {stats.totalUsers}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-sm text-slate-500">
              Total Admins
            </h3>
            <p className="text-3xl font-extrabold mt-2 text-emerald-600">
              {stats.totalAdmins}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-sm text-slate-500">
              Total Products
            </h3>
            <p className="text-3xl font-extrabold mt-2 text-orange-600">
              {stats.totalProducts}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
