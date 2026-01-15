import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { PiCurrencyInrLight } from "react-icons/pi";
import { useAuth } from "../contexts/AuthProvider";
import { toast } from "react-toastify";

const SingleProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false); // 🔥 ADD TO CART LOADER

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await instance.get(`/product/slug/${slug}`);

        setTimeout(() => {
          setProduct(res.data);
          setMainImage(res.data.images[0]);
          setLoading(false);
        }, 1000);
      } catch {
        setLoading(false);
        toast.error("Product not found");
      }
    }
    fetchProduct();
  }, [slug]);

  async function handleAddToCart(productId) {
    if (!isLoggedIn) {
      toast.info("Please login first");
      navigate(`/login?nextPage=/product/${slug}`);
      return;
    }

    try {
      setCartLoading(true); // 🔥 start button loader

      await instance.post(
        "/cart/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );

      toast.success("Added to cart 🛒");

      setTimeout(() => {
        setCartLoading(false);
        navigate("/cart");
      }, 1000); // ⏳ 1 sec loader
    } catch {
      setCartLoading(false);
      toast.error("Failed to add product");
    }
  }

  // PAGE LOADER
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-semibold">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* IMAGE SECTION */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border
                  ${
                    mainImage === img
                      ? "border-indigo-600 ring-2 ring-indigo-400"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
              />
            ))}
          </div>

          <div className="flex-1 h-[420px] rounded-xl overflow-hidden shadow-lg bg-gray-100">
            <img
              src={mainImage.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-green-600 flex items-center gap-1">
              <PiCurrencyInrLight />
              {product.discountedPrice}
            </span>
            <del className="text-lg text-gray-400">
              ₹{product.originalPrice}
            </del>
          </div>

          <p className="text-gray-700 mb-8">
            {product.description}
          </p>

          {/* 🔥 ADD TO CART BUTTON WITH LOADER */}
          <button
            onClick={() => handleAddToCart(product._id)}
            disabled={cartLoading}
            className={`px-8 py-3 rounded-lg font-semibold text-white
              flex items-center justify-center gap-2
              ${
                cartLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
          >
            {cartLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
