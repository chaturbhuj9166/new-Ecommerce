import express from "express";
import {
  placeOrder,
  getMyOrders,
} from "../controllers/orderController.js";

import { checkAuth } from "../middlewares/MiddlewaresAuth.js";

const router = express.Router();

router.post("/", checkAuth, placeOrder);
router.get("/my", checkAuth, getMyOrders); // Get My Orders


export default router;
