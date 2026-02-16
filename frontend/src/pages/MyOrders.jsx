import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { PiCurrencyInrLight } from "react-icons/pi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await instance.get("/api/orders/my", {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        No orders found 📦
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h2 className="text-3xl font-bold mb-8">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border rounded-xl shadow-md p-6 mb-8"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">

            <div>
              <p className="font-semibold">
                Order ID: {order._id}
              </p>

              <p className="text-sm text-gray-500">
                Ordered On:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              {order.deliveryDate && (
                <p className="text-sm text-blue-600">
                  Expected Delivery:{" "}
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>

          </div>

          {/* ITEMS */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span className="flex items-center gap-1 font-medium">
                  <PiCurrencyInrLight />
                  {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="text-right mt-4 font-bold text-lg">
            Total: ₹{order.totalAmount}
          </div>

          {/* SHIPPING ADDRESS */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Shipping To:</strong>{" "}
              {order.shippingAddress?.address},{" "}
              {order.shippingAddress?.city} -{" "}
              {order.shippingAddress?.pincode}
            </p>
          </div>
        </div>
      ))}

    </div>
  );
};

export default MyOrders;
