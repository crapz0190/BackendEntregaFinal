import { Router } from "express";
import passport from "passport";
import { productCtrl } from "../controllers/products.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.products.middleware.js";

const router = Router();

const fieldNames = Array.from({ length: 10 }, (_, index) => ({
  name: `thumbnails${index}`,
}));

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  productCtrl.allProducts,
);

router.get(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  productCtrl.productById,
);

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["admin", "premium"]),
  // upload.array("thumbnails", 6),
  upload.fields(fieldNames),
  productCtrl.addProduct,
);

router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["admin", "premium"]),
  productCtrl.updateProdById,
);

router.put(
  "/:pid/add-images",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["admin", "premium"]),
  // upload.array("thumbnails", 6),
  upload.fields(fieldNames),
  productCtrl.addImgByProductId,
);

router.delete(
  "/:pid/delete-image",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["admin", "premium"]),
  productCtrl.delImgByProductId,
);

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  productCtrl.delProdById,
);

export default router;
