import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useAuth } from "../contexts/AuthProvider";
import { useCart } from "../contexts/CartProvider";
import { PiCurrencyInrLight } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

const Cart = () => {
  const { isLoggedIn } = useAuth();
  const { cartItems, setCartItems } = useCart();

  const [loading, setLoading] = useState(true);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const res = await instance.get("/cart", {
        withCredentials: true,
      });

      const cartArray = Array.isArray(res.data)
        ? res.data
        : res.data.cart || [];

      const validItems = cartArray
        .filter((item) => item.productId)
        .map((item) => ({
          ...item,
          quantity: Number(item.quantity),
        }));

      setCartItems(validItems);
    } catch (err) {
      console.error("Fetch cart error:", err);
      toast.error("Failed to load cart");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  /* ================= REMOVE ITEM ================= */
  const handleRemove = async (cartItemId) => {
    try {
      await instance.delete(`/cart/remove/${cartItemId}`, {
        withCredentials: true,
      });

      setCartItems((prev) =>
        prev.filter((item) => item._id !== cartItemId)
      );

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove item");
    }
  };

  /* ================= INCREASE ================= */
  const handleIncrease = async (productId) => {
    try {
      await instance.post(
        "/cart/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

      toast.info("Quantity increased");
    } catch (error) {
      console.error("Increase error:", error);
      toast.error("Failed to update quantity");
    }
  };

  /* ================= DECREASE ================= */
  const handleDecrease = async (cartItemId, productId, qty) => {
    if (qty <= 1) {
      handleRemove(cartItemId);
      return;
    }

    try {
      await instance.post(
        "/cart/add",
        { productId, quantity: -1 },
        { withCredentials: true }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );

      toast.info("Quantity decreased");
    } catch (error) {
      console.error("Decrease error:", error);
      toast.error("Failed to update quantity");
    }
  };

  /* ================= TOTAL ================= */
  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.productId.discountedPrice ||
        item.productId.originalPrice) *
        item.quantity,
    0
  );

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async () => {
    try {
      setCouponError("");
      const res = await instance.post("/coupon/apply", {
        code: couponCode,
        cartTotal: totalAmount,
      });

      setDiscount(res.data.discountAmount);
      toast.success("Coupon applied successfully 🎉");
    } catch (error) {
      setDiscount(0);
      const msg =
        error.response?.data?.message || "Invalid coupon";
      setCouponError(msg);
      toast.error(msg);
    }
  };

  const finalAmount = totalAmount - discount;

  /* ================= UI STATES ================= */
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">
          Please login to see your cart.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">Loading cart...</p>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">
          Your cart is empty.
        </p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row gap-6 bg-white border rounded-xl p-4 hover:shadow-lg transition"
          >
            <img
  src={
    item.productId?.images?.length
      ? `${import.meta.env.VITE_BASEURL}/${item.productId.images[0]}`
      : "/no-image.png"
  }
  alt={item.productId.name}
  className="w-full md:w-32 h-32 object-cover rounded-lg border"
/>


            <div className="flex-1 space-y-3">
              <h2 className="text-lg font-semibold">
                {item.productId.name}
              </h2>

              <p className="flex items-center gap-1">
                <PiCurrencyInrLight />
                {item.productId.discountedPrice ||
                  item.productId.originalPrice}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleDecrease(
                      item._id,
                      item.productId._id,
                      item.quantity
                    )
                  }
                  className="w-8 h-8 border rounded-full"
                >
                  −
                </button>

                <span className="font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleIncrease(item.productId._id)
                  }
                  className="w-8 h-8 border rounded-full"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemove(item._id)}
                className="flex items-center gap-1 text-red-600 text-sm"
              >
                <AiOutlineDelete />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mt-8 flex justify-end">
        <div className="bg-white p-4 rounded-xl shadow w-full sm:w-96 space-y-3">
          <h3 className="font-semibold">Apply Coupon</h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(e.target.value.toUpperCase())
              }
              className="flex-1 border px-3 py-2 rounded-lg"
            />

            <button
              onClick={applyCoupon}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Apply
            </button>
          </div>

          {couponError && (
            <p className="text-red-500 text-sm">
              {couponError}
            </p>
          )}

          {discount > 0 && (
            <p className="text-green-600 text-sm font-medium">
              Discount Applied: ₹{discount}
            </p>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="mt-8 flex justify-end">
        <div className="bg-white border p-5 rounded-xl shadow w-full sm:w-96 space-y-3">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span className="flex items-center gap-1">
              <PiCurrencyInrLight /> {totalAmount}
            </span>
          </p>

          <p className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="flex items-center gap-1">
              − <PiCurrencyInrLight /> {discount}
            </span>
          </p>

          <hr />

          <h2 className="text-lg font-bold flex justify-between">
            <span>Total Payable</span>
            <span className="flex items-center gap-1">
              <PiCurrencyInrLight /> {finalAmount}
            </span>
          </h2>

          <button className="w-full mt-4 bg-black text-white py-3 rounded-lg hover:bg-gray-800">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
