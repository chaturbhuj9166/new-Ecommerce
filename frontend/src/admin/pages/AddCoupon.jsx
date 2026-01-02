import React, { useState } from "react";
import instance from "../../axiosConfig";

const AddCoupon = () => {
  const [form, setForm] = useState({
    code: "",
    discount: "",
    startDate: "",
    expiryDate: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post("/coupon/add", form);
      setMessage("Coupon added successfully");
      setForm({ code: "", discount: "", startDate: "", expiryDate: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add coupon");
    }
  };

  return (
    <div className="admin-page">
      <h2>Add Coupon</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={form.code}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="discount"
          placeholder="Discount %"
          value={form.discount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Coupon</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCoupon;
