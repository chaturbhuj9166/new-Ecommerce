import { Router } from "express";
import { checkForlogin } from "../middlewares/MiddlewarresAuth.js";

const checkRouter = Router();

// ✅ middleware ko PROPER express way me use karo
checkRouter.get("/login", checkForlogin, (req, res) => {
  res.status(200).json({
    message: "Logged in",
    userId: req.userId,
    role: req.userRole,
  });
});

export default checkRouter;
