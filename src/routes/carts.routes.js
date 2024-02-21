import { Router } from "express";
import passport from "passport";
import { cartCtrl } from "../controllers/carts.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// ruta GET para mostrar todos los carritos
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["admin", "premium"]),
  cartCtrl.allCarts,
);

// ruta GET para encontrar carritos por ID
router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["user"]),
  cartCtrl.cartById,
);

// ruta POST para finalizar el proceso de compra
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["user"]),
  cartCtrl.purchasingProcess,
);

// ruta PUT para agregar productos a un carrito
router.put(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["user"]),
  cartCtrl.updateCart,
);

// ruta DELETE para eliminar un producto del carrito
router.delete(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["user"]),
  cartCtrl.removeProductByCart,
);

export default router;
