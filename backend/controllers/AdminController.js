import Auth from "../models/Authmodel.js";
import Product from "../models/Productmodel.js"; // 🔥 product model add
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

/* ================= ADMIN LOGIN ================= */
export async function loginAdmin(req, res) {
  try { 
    const data = req.body;

    const user = await Auth.findOne({ email: data.email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    if (user.role !== "admin")
      return res.status(401).json({ message: "You are not an Admin" });

    const doesPasswordMatch = await bcrypt.compare(
      data.password,
      user.password
    );
    if (!doesPasswordMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    const admin_token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("admin_token", admin_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600*1000,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/* ================= ADMIN LOGOUT ================= */
export async function logoutAdmin(req, res) {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: -1,
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/* ================= UPDATE ADMIN ================= */
export async function updateAdmin(req, res) {
  return res.status(200).json({ message: "Update Admin API ready" });
}

/* ================= ADMIN DASHBOARD STATS ================= */
export async function adminStats(req, res) {
  try {
    const totalUsers = await Auth.countDocuments({ role: "user" });
    const totalAdmins = await Auth.countDocuments({ role: "admin" });
    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      totalUsers,
      totalAdmins,
      totalProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
