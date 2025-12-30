import express from "express";
import data from "./data.js";
import connectToDB from "./db/connect.js";

import productRouter from "./routes/productRouter.js";
import authRouter from "./routes/Auth.js";
import cors from "cors";
import adminRouter from "./routes/Admin.js";
import checkRouter from "./routes/Check.js";
import cartRouter from "./routes/cart.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());

await connectToDB();

app.use(
  cors({
    origin: "https://new-ecommerce-t48z.onrender.com",

    credentials: true,
  })
);


app.use("/product", productRouter);
app.use("/user", authRouter);
app.use("/admin",adminRouter)

app.use("/check", checkRouter)
app.use("/uploads", express.static("uploads"));
app.use("/cart",cartRouter)

app.listen(3000, () => console.log("Server started at port 3000"));






