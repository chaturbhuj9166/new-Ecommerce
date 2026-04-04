import Auth from "../models/Authmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



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

    const user = await Auth.create({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      role: "user",
      isBlocked: false,
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================= LOGIN =================
export async function loginUsers(req, res) {
  try {
    const { email, password } = req.body;

    // 🔥 validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // 🔥 email ya username se login
    const user = await Auth.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 🔥 token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // 🔥 cookie fix (dev + prod)
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
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
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ================= LOGOUT =================
export async function logoutUsers(req, res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });
  return res.status(200).json({ message: "Logout successful" });
}
// ================= GET USERS =================
export async function getUsers(req, res) {
  try {
    const users = await Auth.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// ================= UPDATE =================
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

// ================= DELETE =================
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

// ================= BLOCK =================
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
