import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  updateAdmin,
  adminStats       // 🔥 ADD
} from "../controllers/AdminController.js";

const adminRouter = Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);
adminRouter.put("/:id", updateAdmin);

// 🔥 DASHBOARD STATS
adminRouter.get("/dashboard-stats", adminStats);

export default adminRouter;
