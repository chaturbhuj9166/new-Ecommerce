import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { PiCurrencyInrLight } from "react-icons/pi";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthProvider";

const SingleProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await instance.get(`/product/slug/${slug}`);
        setProduct(res.data);
        setMainImage(res.data.images[0]);
        setLoading(false);
      } catch {
        setLoading(false);
        toast.error("Product not found");
      }
    }

    fetchProduct();
  }, [slug]);

  // ================= ADD TO CART (BACKEND) =================
  async function handleAddToCart(product) {
    if (!isLoggedIn) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);

      await instance.post(
        "/cart/add",
        {
          productId: product._id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      toast.success("Added to cart 🛒");

      setTimeout(() => {
        setCartLoading(false);
        navigate("/cart");
      }, 600);

    } catch (error) {
      setCartLoading(false);

      if (error.response?.status === 401) {
        toast.info("Session expired, please login again");
        navigate("/login");
        return;
      }

      toast.error("Failed to add to cart");
    }
  }

  // ================= ADD TO WISHLIST (FRONTEND) =================
  function handleAddToWishlist(product) {
    if (!isLoggedIn) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyExists = wishlist.find((item) => item._id === product._id);

    if (alreadyExists) {
      toast.info("Already in wishlist ❤️");
      navigate("/wishlist");
      return;
    }

    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    toast.success("Added to wishlist ❤️");

    setTimeout(() => {
      navigate("/wishlist");
    }, 600);
  }

  // ================= LOADER =================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
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
                alt=""
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border
                  ${
                    mainImage?._id === img._id
                      ? "border-indigo-600 ring-2 ring-indigo-400"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
              />
            ))}
          </div>

          <div className="flex-1 h-[420px] rounded-xl overflow-hidden shadow-lg bg-gray-100">
            <img
              src={mainImage?.url}
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

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* ADD TO CART */}
            <button
              onClick={() => handleAddToCart(product)}
              disabled={cartLoading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition
                ${
                  cartLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
            >
              {cartLoading ? "Adding..." : "Add to Cart 🛒"}
            </button>

            {/* ADD TO WISHLIST */}
            <button
              onClick={() => handleAddToWishlist(product)}
              className="px-8 py-3 rounded-lg font-semibold border
                         border-black text-black hover:bg-black hover:text-white transition"
            >
              Add to Wishlist ❤️
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
