import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectToDB from "./db/connect.js";

import productRouter from "./routes/productRouter.js";
import authRouter from "./routes/Auth.js";
import adminRouter from "./routes/admin.js"; // ✅ ONLY THIS
import cartRouter from "./routes/Cart.js";
import checkRouter from "./routes/Check.js";
import couponRouter from "./routes/Coupon.js";

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ================= DATABASE ================= */
await connectToDB();

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================= ROUTES ================= */
app.use("/product", productRouter);
app.use("/user", authRouter);
app.use("/admin", adminRouter); // ✅ FIXED
app.use("/check", checkRouter);
app.use("/cart", cartRouter);
app.use("/coupon", couponRouter);

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server started at http://localhost:${PORT}`)
);
