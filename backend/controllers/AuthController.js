import Auth from "../models/Authmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/otp.js";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/sendEmail.js";

// ================= REGISTER =================
export async function registerUser(req, res) {
  try {
    const { name, email, username, phone, password } = req.body;

    if (!name || !email || !username || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exist = await Auth.findOne({
      $or: [{ email }, { username }],
    });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await Auth.create({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      role: "user",
      otp,
      otpExpire: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
      isBlocked: false,
    });

    await sendOtpEmail(email, otp);

    return res.status(201).json({
      message: "Registered successfully. OTP sent to email",
      email,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ================= VERIFY OTP =================
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }

    const user = await Auth.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(200).json({ message: "Already verified" });

    if (new Date() > user.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    if (user.otp !== otp.toString())
      return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ================= LOGIN =================
export async function loginUsers(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await Auth.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Verify your email first" });

    if (user.isBlocked)
      return res.status(403).json({ message: "User is blocked" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ================= LOGOUT =================
export async function logoutUsers(req, res) {
  res.clearCookie("auth_token");
  return res.status(200).json({ message: "Logout successful" });
}

// ================= GET ALL USERS =================
export async function getUsers(req, res) {
  try {
    const users = await Auth.find().select("-password -otp -otpExpire");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================= UPDATE USER =================
export async function updateUsers(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await Auth.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================= DELETE USER =================
export async function deleteUsers(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Auth.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================= BLOCK / UNBLOCK USER =================
export async function blockUser(req, res) {
  try {
    const { id } = req.params;

    const user = await Auth.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
