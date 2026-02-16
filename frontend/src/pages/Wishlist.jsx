import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiCurrencyInrLight } from "react-icons/pi";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // ================= LOAD WISHLIST =================
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // ================= REMOVE =================
  function removeFromWishlist(id) {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Removed from wishlist ❤️");
  }

  if (wishlist.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        Your wishlist is empty ❤️
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10">My Wishlist ❤️</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col"
          >
            {/* IMAGE */}
            <img
              src={item.images[0].url}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg cursor-pointer"
              onClick={() => navigate(`/product/${item.slug}`)}
            />

            {/* CONTENT */}
            <div className="flex flex-col flex-grow mt-4">
              
              {/* TITLE */}
              <h2 className="text-lg font-semibold line-clamp-2">
                {item.name}
              </h2>

              {/* PRICE */}
              <div className="flex items-center gap-1 text-green-600 font-bold mt-2">
                <PiCurrencyInrLight />
                {item.discountedPrice}
              </div>

              {/* REMOVE BUTTON FIXED AT BOTTOM */}
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="mt-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
