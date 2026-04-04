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
    category: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    images: [],
  });

  // 🔥 NEW STATE (sizes)
  const [sizes, setSizes] = useState([]);

  const sizeOptions = ["6", "7", "8", "9", "10"];

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

        // 🔥 load sizes in edit
        setSizes(res.data.sizes || []);
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

  // 🔥 SIZE SELECT FUNCTION
  const toggleSize = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("originalPrice", Number(data.originalPrice || 0));
    formData.append("discountedPrice", Number(data.discountedPrice || 0));

    // 🔥 IMPORTANT (sizes send)
    sizes.forEach((size, i) => {
      formData.append(`sizes[${i}]`, size);
    });

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

        <form onSubmit={handleSubmit} className="space-y-5">

          <input name="name" value={data.name} onChange={handleChange} placeholder="Name" className="w-full border px-4 py-2 rounded" />
          <input name="slug" value={data.slug} readOnly className="w-full border px-4 py-2 bg-gray-100 rounded" />

          <select name="category" value={data.category} onChange={handleChange} className="w-full border px-4 py-2 rounded">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          <textarea name="description" value={data.description} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="originalPrice" value={data.originalPrice} onChange={handleChange} placeholder="Original Price" className="border px-4 py-2 rounded" />
            <input type="number" name="discountedPrice" value={data.discountedPrice} onChange={handleChange} placeholder="Discounted Price" className="border px-4 py-2 rounded" />
          </div>

          {/* 🔥 SIZE SELECT UI */}
          <div>
            <h3 className="font-semibold mb-2">Select Sizes</h3>
            <div className="flex gap-2 flex-wrap">
              {sizeOptions.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 border rounded ${
                    sizes.includes(size)
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <input type="file" name="images" multiple onChange={handleChange} />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
            {isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;