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

  const [data, setData] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    images: [],
  });

  useEffect(() => {
    if (isEdit) {
      instance.get(`/product/${productId}`).then((res) => {
        setData({ ...res.data, images: [] });
      });
    }
  }, [isEdit, productId]);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "images") {
      setData({ ...data, images: Array.from(files) });
    } else if (name === "name") {
      setData({
        ...data,
        name: value,
        slug: isEdit ? data.slug : generateSlug(value),
      });
    } else {
      setData({ ...data, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "images") {
        data.images.forEach((img) =>
          formData.append("images", img)
        );
      } else {
        formData.append(key, data[key]);
      }
    });

    if (isEdit) {
      await instance.put(`/product/${productId}`, formData);
      toast.success("Product updated");
    } else {
      await instance.post("/product", formData);
      toast.success("Product added");
    }

    navigate("/admin/manage");
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
            <label className="block text-sm font-semibold mb-1">Product Name</label>
            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full rounded-lg border px-4 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="block text-sm font-semibold mb-1">Slug</label>
            <input
              name="slug"
              value={data.slug}
              readOnly
              placeholder="Auto generated"
              className="w-full rounded-lg border bg-gray-100
                         px-4 py-2 cursor-not-allowed"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <input
              name="category"
              value={data.category}
              onChange={handleChange}
              placeholder="Category"
              required
              className="w-full rounded-lg border px-4 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              rows="4"
              placeholder="Product description"
              required
              className="w-full rounded-lg border px-4 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* PRICES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={data.originalPrice}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2
                           focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Discounted Price</label>
              <input
                type="number"
                name="discountedPrice"
                value={data.discountedPrice}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-2
                           focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Product Images (Max 5)
            </label>

            <div className="border-2 border-dashed rounded-xl p-6 text-center
                            hover:border-indigo-500 transition">
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload up to 5 images (Amazon style gallery)
              </p>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold
                       bg-indigo-600 hover:bg-indigo-700
                       transition shadow-lg"
          >
            {isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
