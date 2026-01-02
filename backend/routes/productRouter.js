// import Router from "express";
// import { addProduct, deleteProduct, getProduct, updateProduct, checkSlug,getProductBySlug} from "../controllers/product.js"

// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//     destination: function (req, fill, cb) {
//         cb(null, "uploads")
//     },
//     filename: function (req, file, cb) {
//         const filename = req.body.slug + path.extname(file.originalname)
//         cb(null, filename)
//     }
// })

// const uploads = multer({ storage: storage })

// const productRouter = Router()

// productRouter.get("/", getProduct)
// productRouter.post("/", uploads.single("image"), addProduct)
// productRouter.put("/:id", updateProduct)
// productRouter.delete("/:id", deleteProduct)
// productRouter.get('/checkSlug/:slug', checkSlug)
// productRouter.get("/slug/:slug", getProductBySlug);

// export default productRouter






import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  checkSlug,
  getProductBySlug
} from "../controllers/product.js";

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.slug + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const productRouter = Router();

productRouter.get("/", getProduct);
productRouter.post("/", upload.single("image"), addProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/checkSlug/:slug", checkSlug);
productRouter.get("/slug/:slug", getProductBySlug);

export default productRouter;
