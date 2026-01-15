import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosConfig.js";
import { toast } from "react-toastify";

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

const AddCategory = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    slug: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    
    if (name === "name") {
      setData({
        ...data,
        name: value,
        slug: generateSlug(value),
      });
    } else {
      setData({ ...data, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await instance.post("/category/create", data);
      toast.success("Category added successfully");
      navigate("/admin/manage"); // Or wherever we should redirect
    } catch (error) {

      const errMsg = error.response?.data?.message || "Failed to add category";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add Category</h2>
          
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 text-sm font-semibold rounded-lg
                       border border-indigo-600 text-indigo-600
                       hover:bg-indigo-600 hover:text-white transition"
          >
            ← Back
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Category Name
            </label>
            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Electronics"
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Slug (Auto-generated)
            </label>
            <input
              name="slug"
              value={data.slug}
              readOnly
              className="w-full rounded-lg border bg-gray-100
                         px-4 py-2 cursor-not-allowed text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold flex justify-center
                       transition ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddCategory;
