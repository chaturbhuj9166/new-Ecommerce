import express from "express";
import { addCoupon, applyCoupon} from "../controllers/Coupon.js";

const router = express.Router();

// Admin: Add coupon
router.post("/add", addCoupon);

// User: Apply coupon
router.post("/apply", applyCoupon);

// Admin: Get all coupons
// router.get("/all", getAllCoupons);

export default router;