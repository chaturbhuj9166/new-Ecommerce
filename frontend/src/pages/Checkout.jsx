import { useState, useEffect } from "react";
import instance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    secondaryPhone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await instance.get("/cart", { withCredentials: true });
      setCartItems(res.data);
    } catch (error) {
      toast.error("Failed to load cart");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.productId.discountedPrice * Number(item.quantity),
    0
  );

  const deliveryCharge = 50;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      toast.error("Fill all required fields");
      return;
    }

    try {
      setPlacingOrder(true);

      await instance.post(
        "/api/orders",
        {
          shippingAddress: form,
          paymentMethod,
        },
        { withCredentials: true }
      );

      toast.success("Order placed 🎉");
      navigate("/my-orders");

    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    }

    setPlacingOrder(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      <h2 className="text-3xl font-bold mb-8">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE - FORM */}
        <div className="bg-white p-8 shadow rounded-xl">

          <h3 className="text-xl font-semibold mb-6">Shipping Details</h3>

          <div className="space-y-4">

            <input
              name="name"
              placeholder="Full Name *"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

            <input
              name="phone"
              placeholder="Primary Phone *"
              value={form.phone}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

            <input
              name="secondaryPhone"
              placeholder="Alternate Phone"
              value={form.secondaryPhone}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

            <input
              name="address"
              placeholder="Full Address *"
              value={form.address}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

            <input
              name="city"
              placeholder="City *"
              value={form.city}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

            <input
              name="pincode"
              placeholder="Pincode *"
              value={form.pincode}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />
          </div>

          {/* PAYMENT METHOD */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

            <div className="space-y-3">

              <label className="flex gap-3 border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>

              <label className="flex gap-3 border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                UPI
              </label>

              <label className="flex gap-3 border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Card Payment
              </label>

            </div>
          </div>

        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="bg-gray-50 p-8 shadow rounded-xl">

          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between mb-3">
              <span>{item.productId.name} × {item.quantity}</span>
              <span>
                ₹{item.productId.discountedPrice * item.quantity}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span>₹{deliveryCharge}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
