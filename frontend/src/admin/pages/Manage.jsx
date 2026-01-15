import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Manage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASEURL}/product`)
      .then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Products
          </h1>
          <p className="text-gray-500">
            Add, edit and manage your products
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-gray-400 text-gray-700
                       hover:bg-gray-200 transition"
          >
            <FaArrowLeft /> Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/product/add")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-indigo-600 text-white font-semibold
                       hover:bg-indigo-700 transition shadow"
          >
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, index) => (
              <tr
                key={p._id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-indigo-50 transition`}
              >
                <td className="p-3">
                  <img
                    src={p.images[0]?.url}
                    className="w-12 h-12 rounded object-cover border"
                    alt={p.name}
                  />
                </td>

                <td className="p-3 font-medium text-gray-800">
                  {p.name}
                </td>

                <td className="p-3 font-semibold text-green-600">
                  ₹{p.discountedPrice}
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-4">
                    <FaEdit
                      className="text-blue-600 cursor-pointer hover:scale-110 transition"
                      title="Edit Product"
                      onClick={() =>
                        navigate("/admin/product/add", {
                          state: { productId: p._id },
                        })
                      }
                    />

                    <FaTrash
                      className="text-red-600 cursor-pointer hover:scale-110 transition"
                      title="Delete Product"
                    />
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manage;
