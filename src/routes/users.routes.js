import { Router } from "express";
import passport from "passport";
import { userCtrl } from "../controllers/users.controllers.js";
import { validateSchema } from "../middlewares/validator.schema.middleware.js";
import {
  emailPwdSchema,
  loginSchema,
  registerSchema,
  resetPwdSchema,
} from "../schemas/auth.schema.js";
import { upload } from "../middlewares/multer.products.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// ruta GET para ver la compra
router.get(
  "/:uid/finalize-purchase",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["user"]),
  userCtrl.purchase,
);

// sólo actualiza si el usuario ya cargo los documentos
router.put(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  userCtrl.userRolePremium,
);

router.post(
  "/:uid/documents",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    {
      name: "dni",
      maxCount: 1,
    },
    {
      name: "address",
      maxCount: 1,
    },
    {
      name: "bank",
      maxCount: 1,
    },
  ]),
  userCtrl.saveUserDocument,
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["admin"]),
  userCtrl.currentUser,
);

router.get(
  "/:uid",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["user"]),
  userCtrl.userFoundById,
);

// Ruta POST para enviar email
router.post(
  "/verify-account",
  passport.authenticate("jwt", {
    session: false,
  }),
  userCtrl.verifyAccount,
);

// Ruta PUT para validar cuenta y actualizar el estado del usuario
router.put("/verified-account/:token", userCtrl.verifiedAccount);

// Ruta POST para registrarse
router.post(
  "/signup",
  validateSchema(registerSchema),
  passport.authenticate("signup", {
    // failureMessage: true,
    // successRedirect: "/api/users/successful",
    // failureRedirect: "/api/users/error",
    session: false,
  }),
  userCtrl.registerUser,
);

// Ruta POST para loguearse
router.post(
  "/login",
  validateSchema(loginSchema),
  passport.authenticate("login", {
    // failureMessage: true,
    failureRedirect: "/api/users/error",
    session: false,
  }),
  userCtrl.loginUser,
);

// Ruta POST para cerrar sesión
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  userCtrl.logout,
);

// ruta POST permite enviar correro para restaurar contraseña
router.post(
  "/forgot-password",
  validateSchema(emailPwdSchema),
  userCtrl.emailRestorePass,
);

// Ruta POST para reestablecer contraseña
router.put(
  "/:uid/reset-password/:token",
  validateSchema(resetPwdSchema),
  userCtrl.resetPasswordToken,
);

router.post(
  "/activate-account-closure",
  passport.authenticate("jwt", { session: false }),
  userCtrl.accountClousureVerified,
);

router.delete(
  "/inactive-user",
  passport.authenticate("jwt", { session: false }),
  userCtrl.removeInactiveUser,
);

router.delete(
  "/:uid/delete-cart/:cid",
  passport.authenticate("jwt", { session: false }),
  userCtrl.removeUser,
);

// ------------ SIGNUP - LOGIN - PASSPORT GITHUB ------------

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

router.get(
  "/callback",
  passport.authenticate("github", {
    successRedirect: "/api/users/current",
    failureRedirect: "/api/users/login",
    session: false,
  }),
);

export default router;
