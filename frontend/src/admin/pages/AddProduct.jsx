import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosConfig.js";

function AddProduct() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    image: null,
  });

  const [slugError, setSlugError] = useState("");

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "image") {
      setData({ ...data, image: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  }

  // 🔹 Generate slug from name
  async function createSlug(e) {
    const nameValue = e.target.value;
    if (!nameValue) return;

    const slug = nameValue
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    setData((prev) => ({ ...prev, slug }));
    checkSlug(slug);
  }

  // 🔹 Check slug availability
  async function checkSlug(slug) {
    try {
      await instance.get(`/product/checkSlug/${slug}`);
      setSlugError("");
    } catch (err) {
      if (err.response?.data?.message) {
        setSlugError(err.response.data.message);
        setData((prev) => ({ ...prev, slug: "" }));
      }
    }
  }

  // 🔹 Submit product
  async function handleSubmit(e) {
    e.preventDefault();

    if (!data.slug) {
      alert("Slug is required and must be unique");
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      await instance.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product added successfully!");

      setData({
        name: "",
        slug: "",
        category: "",
        description: "",
        originalPrice: "",
        discountedPrice: "",
        image: null,
      });
      setSlugError("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-8">

        {/* HEADER + BACK BUTTON */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Add a New Product
          </h2>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-sm px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={data.name}
            onChange={handleChange}
            onBlur={createSlug}
            required
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none"
          />

          <input
            type="text"
            name="slug"
            value={data.slug}
            readOnly
            placeholder="Slug auto-generated"
            className="w-full border bg-slate-100 rounded-md px-4 py-2"
          />

          {slugError && (
            <p className="text-red-500 text-sm">{slugError}</p>
          )}

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={data.category}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={data.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price"
              value={data.originalPrice}
              onChange={handleChange}
              required
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none"
            />

            <input
              type="number"
              name="discountedPrice"
              placeholder="Discounted Price"
              value={data.discountedPrice}
              onChange={handleChange}
              required
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-semibold"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
