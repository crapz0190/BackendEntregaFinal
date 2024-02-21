import { Router } from "express";

const router = Router();

router.get("/products", (req, res) => {
  // console.log(req.cookies.token);

  res.send("Ingresando desde GitHub");
});

export default router;
