import Auth from "../models/Authmodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

// ================== GET USERS ==================
export async function getUsers(req, res) {
  try {
    const auth = await Auth.find();
    return res.status(200).json(auth);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================== REGISTER ==================
export async function registerUser(req, res) {
  try {
    const { name, email, username, password, phone, role } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existEmail = await Auth.findOne({ email });
    if (existEmail)
      return res.status(400).json({ message: "Email already exists" });

    const existUser = await Auth.findOne({ username });
    if (existUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Auth({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      role: role || "user", // ✅ default role
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


// ================== LOGIN ==================
export async function loginUsers(req, res) {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const auth_token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("auth_token", auth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600*1000, // 1 hour  
    });

    return res.status(200).json({
      message: "Login success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


// ================== LOGOUT ==================
export async function logoutUsers(req, res) {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({ message: "Logout success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


// ================== DELETE USER ==================
export async function deleteUsers(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Id Parameter is required" });

    const userDeleted = await Auth.findByIdAndDelete(id);
    if (!userDeleted) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================== UPDATE USER ==================
export async function updateUsers(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) return res.status(400).json({ message: "Id Parameter is required" });

    const userUpdate = await Auth.findByIdAndUpdate(id, updates, { new: true });
    if (!userUpdate) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User updated successfully", user: userUpdate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}