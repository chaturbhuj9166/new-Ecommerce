import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../../axiosConfig";
import { toast } from "react-toastify";

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId;
  const isEdit = Boolean(productId);

  const [categories, setCategories] = useState([]);

  const [data, setData] = useState({
    name: "",
    slug: "",
    category: "", // slug store hoga
    description: "",
    originalPrice: "",
    discountedPrice: "",
    images: [],
  });

  // 🔹 Fetch categories
  useEffect(() => {
    instance
      .get("/category")
      .then((res) => setCategories(res.data?.categories || []))
      .catch(() => {
        setCategories([]);
        toast.error("Failed to load categories");
      });
  }, []);

  // 🔹 Fetch product (edit mode)
  useEffect(() => {
    if (isEdit) {
      instance.get(`/product/${productId}`).then((res) => {
        setData({
          ...res.data,
          images: [],
          originalPrice: res.data.originalPrice?.toString() || "",
          discountedPrice: res.data.discountedPrice?.toString() || "",
        });
      });
    }
  }, [isEdit, productId]);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "images") {
      setData({ ...data, images: Array.from(files) });
    } 
    else if (name === "name") {
      setData({
        ...data,
        name: value,
        slug: isEdit ? data.slug : generateSlug(value),
      });
    } 
    else {
      setData({ ...data, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    // Append simple fields explicitly to control formats
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("originalPrice", Number(data.originalPrice || 0));
    formData.append("discountedPrice", Number(data.discountedPrice || 0));

    // Append files only if they are File objects (new uploads)
    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });
    }

    try {
      if (isEdit) {
        await instance.put(`/product/${productId}`, formData);
        toast.success("Product updated");
      } else {
        await instance.post("/product", formData);
        toast.success("Product added");
      }

      navigate("/admin/manage");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={() => navigate("/admin/manage")}
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
              Product Name
            </label>
            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Slug
            </label>
            <input
              name="slug"
              value={data.slug}
              readOnly
              className="w-full rounded-lg border bg-gray-100
                         px-4 py-2 cursor-not-allowed"
            />
          </div>

          {/* ✅ CATEGORY DROPDOWN */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Category
            </label>
            <select
              name="category"
              value={data.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
            >  
              <option value="">Select Category</option>
              {(Array.isArray(categories) ? categories : []).map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full rounded-lg border px-4 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* PRICES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="originalPrice"
              value={data.originalPrice}
              onChange={handleChange}
              placeholder="Original Price"
              required
              className="w-full rounded-lg border px-4 py-2"
            />
            <input
              type="number"
              name="discountedPrice"
              value={data.discountedPrice}
              onChange={handleChange}
              placeholder="Discounted Price"
              required
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* IMAGES */}
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold
                       bg-indigo-600 hover:bg-indigo-700 transition"
          >
            {isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
