import { Router } from "express";
import {
  deleteUsers,
  getUsers,
  loginUsers,
  logoutUsers,
  registerUser,
  updateUsers,
} from "../controllers/AuthController.js";
import { googleLogin } from "../controllers/googleLogin.js";

const authRouter = Router();

authRouter.get("/", getUsers);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUsers);

authRouter.post("/logout", logoutUsers);
authRouter.delete("/:id", deleteUsers);
authRouter.put("/:id", updateUsers);
authRouter.post("/google-login", googleLogin);

export default authRouter;
