import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { PiCurrencyInrLight } from "react-icons/pi";
import { useAuth } from "../contexts/AuthProvider";


const SingleProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn } = useAuth();

  async function getSingleData() {
    try {
      const response = await instance.get(`/product/slug/${slug}`);
      setProduct(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSingleData();
  }, [slug]);

  async function handleAddToCart(productId) {
  if (!isLoggedIn) {
    navigate(`/login?nextPage=/product/${slug}`);
    return;
  }

  try {
    const response = await instance.post(
      "/cart/add",
      { productId, quantity: 1 },
      { withCredentials: true }
    );

    if (response.status === 200 || response.status === 201) {
      alert("Product added successfully!");

      // ✅ Redirect to cart page
      navigate("/cart");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to add product!");
  }
}


  // 🔹 Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );

  // 🔹 Not found
  if (!product)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500 text-lg">Product not found</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image */}
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow">
          <img
            src={`${import.meta.env.VITE_BASEURL}/${product.image}`}
            alt={product.name}
            className="w-full h-full object-canver"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {product.name}
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            {product.category}
          </p>

          {/* Price */}
          <p className="flex items-center gap-2 text-xl mb-4">
            <PiCurrencyInrLight />
            {product.discountedPrice &&
            product.discountedPrice < product.originalPrice ? (
              <>
                <del className="text-gray-400">
                  {product.originalPrice}
                </del>
                <span className="text-green-600 font-bold">
                  {product.discountedPrice}
                </span>
              </>
            ) : (
              <span className="font-bold">
                {product.originalPrice}
              </span>
            )}
          </p>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Button */}
          <button
            onClick={() => handleAddToCart(product._id)}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
};

export default SingleProduct;
