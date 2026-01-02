import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
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
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/Manage"
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Manage Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/AddProduct" 
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Add Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/AddCoupon"
              className="block px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Create Coupon
            </Link>
          </li>
        </ul>

        <button className="mt-auto bg-red-500 hover:bg-red-600 transition py-2 rounded-lg font-semibold">
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Admin Dashboard
          </h1>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Total Users</h3>
            <p className="text-3xl font-extrabold text-slate-800 mt-2">
             0
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Total Products</h3>
            <p className="text-3xl font-extrabold text-slate-800 mt-2">
             0
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Total Orders</h3>
            <p className="text-3xl font-extrabold text-slate-800 mt-2">
              0
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Revenue</h3>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">
              ₹0
            </p>
          </div>
        </div>

        {/* CHART PLACEHOLDER */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Sales Chart
          </h3>
          <p className="text-slate-500">
            Chart Component Here (Recharts / Chart.js)
          </p>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
