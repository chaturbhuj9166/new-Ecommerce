import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { useAuth } from "../contexts/AuthProvider";
import { useCart } from "../contexts/CartProvider";
import { PiCurrencyInrLight } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";

const Cart = () => {
  const { isLoggedIn } = useAuth();
  const { cartItems, setCartItems } = useCart();

  const [loading, setLoading] = useState(true);

// 🔹 Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [couponError, setCouponError] = useState("");

  // 🔹 Fetch Cart
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
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  // 🔹 Remove Item
  const handleRemove = async (cartItemId) => {
    try {
      await instance.delete(`/cart/remove/${cartItemId}`, {
        withCredentials: true,
      });

      setCartItems((prev) =>
        prev.filter((item) => item._id !== cartItemId)
      );
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  // 🔹 Increase Quantity
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
    } catch (error) {
      console.error("Increase error:", error);
    }
  };

  // 🔹 Decrease Quantity
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
    } catch (error) {
      console.error("Decrease error:", error);
    }
  };

  // 🔹 Total Amount
  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.productId.discountedPrice ||
        item.productId.originalPrice) *
        item.quantity,
    0
  );
// 🔹 Apply Coupon
  const applyCoupon = async () => {
    try {
      setCouponError("");
      const res = await instance.post("/coupon/apply", {
        code: couponCode,
        cartTotal: totalAmount,
      });

      setDiscount(res.data.discountAmount);
      setFinalPrice(res.data.finalPrice);
    } catch (error) {
      setDiscount(0);
      setFinalPrice(0);
      setCouponError(error.response?.data?.message || "Coupon invalid");
    }
  };
  const finalAmount = totalAmount - discount;

  // 🔹 UI STATES
  if (!isLoggedIn)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg">Please login to see your cart.</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg">Loading cart...</p>
      </div>
    );

  if (!cartItems.length)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg">Your cart is empty.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {/* CART ITEMS */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row gap-6 bg-white shadow rounded-lg p-4"
          >
            <img
              src={`${import.meta.env.VITE_BASEURL}/${item.productId.image}`}
              alt={item.productId.name}
              className="w-32 h-32 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {item.productId.name}
              </h2>

              <p className="flex items-center gap-1 text-gray-700 mb-3">
                <PiCurrencyInrLight />
                {item.productId.discountedPrice ||
                  item.productId.originalPrice}
              </p>

              {/* QUANTITY */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() =>
                    handleDecrease(
                      item._id,
                      item.productId._id,
                      item.quantity
                    )
                  }
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>

                <span className="font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleIncrease(item.productId._id)
                  }
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>

              {/* REMOVE */}
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

      {/* COUPON */}
      {/* <div className="mt-8 flex justify-end">
        <div className="bg-white p-4 rounded-lg shadow w-full sm:w-96">
          <h3 className="font-semibold mb-2">Apply Coupon</h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) =>
                setCoupon(e.target.value.toUpperCase())
              }
              placeholder="Enter coupon code"
              className="flex-1 border px-3 py-2 rounded"
            />

            <button
              onClick={handleApplyCoupon}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Apply
            </button>
          </div>

          {couponError && (
            <p className="text-red-500 text-sm mt-2">
              {couponError}
            </p>
          )}

          {discount > 0 && (
            <p className="text-green-600 text-sm mt-2">
              Discount Applied: ₹{discount}
            </p>
          )}
        </div>
      </div> */}

      <div className="coupon-box">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={applyCoupon}>Apply</button>
                {couponError && <p className="error">{couponError}</p>}
              </div>

      {/* TOTAL */}
      <div className="mt-6 flex justify-end">
        <div className="bg-gray-100 p-4 rounded-lg shadow w-full sm:w-96 space-y-2">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span className="flex items-center gap-1">
              <PiCurrencyInrLight /> {totalAmount}
            </span>
          </p>

          <p className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="flex items-center gap-1">
              - <PiCurrencyInrLight /> {discount}
            </span>
          </p>

          <hr />

          <h2 className="text-xl font-bold flex justify-between">
            <span>Total Payable</span>
            <span className="flex items-center gap-1">
              <PiCurrencyInrLight /> {finalAmount}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Cart;
  