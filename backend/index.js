import express from "express";
import connectToDB from "./db/connect.js";
import "dotenv/config";

import productRouter from "./routes/productRouter.js";
import authRouter from "./routes/Auth.js";
import adminRouter from "./routes/Admin.js";
import cartRouter from "./routes/Cart.js";
import checkRouter from "./routes/Check.js";
import couponRouter from "./routes/Coupon.js";


import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

await connectToDB();

app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/product", productRouter);
app.use("/user", authRouter);
app.use("/admin", adminRouter);
app.use("/check", checkRouter);
app.use("/cart", cartRouter);
app.use("/coupon", couponRouter);


app.listen(3000, () => console.log("Server started at port 3000"));
