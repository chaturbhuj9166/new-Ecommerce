import jwt from "jsonwebtoken";
import "dotenv/config";

export async function checkForlogin(req, res, next, customArg) {
  try {
    const referer = customArg || req.query.referer;
    if (!referer) {
      return res.status(401).json({ message: "Access denied" });
    }

    const cookies = req.cookies || {};
    let token;

    if (referer === "admin") token = cookies.admin_token;
    if (referer === "user") token = cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== referer) {
      return res.status(403).json({ message: "Forbidden: Invalid role" });
    }

    // 🔥🔥🔥 MOST IMPORTANT FIX
    req.user = decoded;        // ✅ ADD THIS
    req.userId = decoded.id;   // (optional)
    req.userRole = decoded.role;

    return next(); // 🔥 MUST
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
