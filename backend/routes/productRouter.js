import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  addProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  checkSlug,
  getProductBySlug,
} from "../controllers/product.js";

const router = Router();

/* ===== MULTER CONFIG ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    ),
});

const upload = multer({ storage });

/* ===== ROUTES ===== */
router.get("/", getProduct);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

router.post("/", upload.array("images", 5), addProduct);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

router.get("/checkSlug/:slug", checkSlug);

export default router;
