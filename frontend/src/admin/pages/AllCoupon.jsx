import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosConfig";

const AllCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH COUPONS ================= */
  const fetchCoupons = async () => {
    try {
      const res = await instance.get("/coupon/all");
      setCoupons(res.data.coupons || []);
    } catch {
      setError("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (!confirmDelete) return;

    try {
      await instance.delete(`/coupon/delete/${id}`);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (coupon) => {
    navigate(`/admin/coupons/edit/${coupon._id}`);
  };

  /* ================= UI STATES ================= */
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-600 text-lg">
          Loading coupons...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  /* ================= MAIN UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-sm"
          >
            ← Back to Dashboard
          </button>

          <h2 className="text-2xl font-bold text-gray-800">
            All Coupons
          </h2>
        </div>

        <button
          onClick={() => navigate("/admin/coupons/add")}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600">
            No coupons found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount (%)</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {coupon.code}
                  </td>

                  <td className="px-6 py-4 text-green-600 font-semibold">
                    {coupon.discount}%
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(
                      coupon.startDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(
                      coupon.expiryDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(coupon._id)
                      }
                      className="px-3 py-1 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllCoupons;
