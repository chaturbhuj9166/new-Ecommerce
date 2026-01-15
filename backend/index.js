import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDB from "./db/connect.js";
import "dotenv/config";

import checkRouter from "./routes/check.js";
import productRouter from "./routes/productRouter.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import cartRouter from "./routes/cart.js";
import couponRouter from "./routes/coupon.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import chatRouter from "./routes/chatRouter.js";


const app = express();

// Allow postMessage from Google popups — relax COOP to allow popups
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(express.json());
/* ================= MIDDLEWARES ================= */

app.use(
  cors({
    origin: "http://localhost:5173",  
    credentials: true,
  })
);
app.use(cookieParser());

/* ================= DATABASE ================= */
await connectToDB();

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================= ROUTES ================= */
app.use("/product", productRouter);
app.use("/user", authRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/check", checkRouter); 
app.use("/coupon", couponRouter);
app.use("/category", categoryRoutes);
app.use("/chat", chatRouter);


/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server started at http://localhost:${PORT}`)
);