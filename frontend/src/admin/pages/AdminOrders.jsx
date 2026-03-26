import React, { useEffect, useState } from "react";
import instance from "../../axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await instance.get(
        "/api/orders/all",
        { withCredentials: true }
      );
      setOrders(res.data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>
        <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 text-sm font-semibold rounded-lg
                       border border-indigo-600 text-indigo-600
                       hover:bg-indigo-600 hover:text-white transition"
          >
            ← Back
          </button>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-xl shadow"
          >
            {/* 🔥 USER */}
            <h3 className="font-bold text-lg">
              👤 {order.user?.name}
            </h3>
            <p className="text-sm text-gray-500">
              {order.user?.email}
            </p>

            {/* 🔥 ITEMS */}
            <div className="mt-3">
              <h4 className="font-semibold">Items:</h4>
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            {/* 🔥 ADDRESS */}
            <div className="mt-3 text-sm text-gray-600">
              📍 {order.shippingAddress.address},{" "}
              {order.shippingAddress.city} -{" "}
              {order.shippingAddress.pincode}
            </div>

            {/* 🔥 TOTAL */}
            <h4 className="mt-3 font-bold">
              ₹ {order.totalAmount}
            </h4>

            {/* 🔥 STATUS */}
            <p className="text-sm mt-1">
              Status:{" "}
              <span className="font-semibold text-indigo-600">
                {order.orderStatus}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;