import { Router } from "express";
import { checkForlogin } from "../middlewares/MiddlewaresAuth.js";

const checkRouter = Router();

// ✅ middleware ko PROPER express way me use karo
checkRouter.get("/login", checkForlogin);

export default checkRouter;
