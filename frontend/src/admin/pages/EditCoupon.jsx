import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../axiosConfig";

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔹 today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    code: "",
    discount: "",
    startDate: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH COUPON ================= */
  useEffect(() => {
    if (!id) {
      setError("Invalid coupon ID");
      setLoading(false);
      return;
    }

    const fetchCoupon = async () => {
      try {
        const res = await instance.get(`/coupon/${id}`);
        const coupon = res.data?.coupon;

        if (!coupon) throw new Error("Coupon not found");

        setForm({
          code: coupon.code || "",
          discount: coupon.discount || "",
          startDate: coupon.startDate
            ? coupon.startDate.split("T")[0]
            : "",
          expiryDate: coupon.expiryDate
            ? coupon.expiryDate.split("T")[0]
            : "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load coupon"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= UPDATE COUPON ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ❌ Start date < today
    if (form.startDate < today) {
      setError("Start date cannot be before today");
      return;
    }

    // ❌ Expiry date < today
    if (form.expiryDate < today) {
      setError("Expiry date cannot be before today");
      return;
    }

    // ❌ Expiry <= Start
    if (form.expiryDate <= form.startDate) {
      setError("Expiry date must be after start date");
      return;
    }

    try {
      await instance.put(`/coupon/update/${id}`, form);
      setSuccess("Coupon updated successfully");

      setTimeout(() => {
        navigate("/admin/coupons");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Update failed"
      );
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-600 text-lg">
          Loading coupon...
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Coupon
          </h2>

          <button
            onClick={() => navigate("/admin/coupons")}
            className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            ← Back to All Coupons
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mb-4 text-red-600 bg-red-50 px-3 py-2 rounded">
            {error}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <p className="mb-4 text-green-600 bg-green-50 px-3 py-2 rounded">
            {success}
          </p>
        )}

        {/* FORM */}
        {!error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                min="1"
                max="100"
                required
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                min={today}  
                required
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                min={form.startDate || today} 
                required
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Update Coupon
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/coupons")}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCoupon;
