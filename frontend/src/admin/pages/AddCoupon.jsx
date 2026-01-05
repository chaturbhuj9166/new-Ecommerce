import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosConfig";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";

const AddCoupon = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    code: "",
    discount: "",
    startDate: "",
    expiryDate: "",
  });

  const [lastCoupon, setLastCoupon] = useState(null); // 🔥 preview state

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));
  };

  /* ================= COPY ================= */
  const handleCopy = () => {
    navigator.clipboard.writeText(lastCoupon.code);
    toast.success("Coupon code copied 📋");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(form.startDate) < new Date(today)) {
      toast.error("Start date cannot be in the past");
      return;
    }

    if (new Date(form.expiryDate) <= new Date(form.startDate)) {
      toast.error("Expiry date must be after start date");
      return;
    }

    try {
      await instance.post("/coupon/add", form, {
        withCredentials: true,
      });

      toast.success("Coupon added successfully 🎉");

      // 🔥 show preview
      setLastCoupon(form);

      // clear form only
      setForm({
        code: "",
        discount: "",
        startDate: "",
        expiryDate: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add coupon"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ================= LEFT FORM ================= */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Add Coupon</h2>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-sm px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              ← Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="code"
              placeholder="COUPON CODE"
              value={form.code}
              onChange={handleChange}
              required
              className="w-full border uppercase px-4 py-2 rounded-md"
            />

            <input
              type="number"
              name="discount"
              placeholder="Discount %"
              value={form.discount}
              onChange={handleChange}
              min="1"
              max="100"
              required
              className="w-full border px-4 py-2 rounded-md"
            />

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              min={today}
              required
              className="w-full border px-4 py-2 rounded-md"
            />

            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              min={form.startDate || today}
              required
              className="w-full border px-4 py-2 rounded-md"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Create Coupon
            </button>
          </form>
        </div>

        {/* ================= RIGHT PREVIEW ================= */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">
            Latest Coupon
          </h3>

          {!lastCoupon ? (
            <p className="text-gray-500">
              No coupon created yet
            </p>
          ) : (
            <div className="border border-dashed border-indigo-500 rounded-xl p-6 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Discount
              </p>

              <p className="text-4xl font-extrabold text-indigo-600">
                {lastCoupon.discount}% OFF
              </p>

              <div className="flex justify-center items-center gap-2">
                <span className="text-lg font-mono bg-gray-100 px-4 py-2 rounded">
                  {lastCoupon.code}
                </span>

                <button
                  onClick={handleCopy}
                  className="p-2 border rounded hover:bg-gray-100"
                >
                  <FaCopy />
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Valid from{" "}
                <strong>{lastCoupon.startDate}</strong> to{" "}
                <strong>{lastCoupon.expiryDate}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCoupon;
