import express from "express";
import morgan from "morgan";
import { join } from "node:path";
import { createServer } from "node:http";
import { __dirname } from "../utils/config.js";
// import { env } from "../utils/config.js";
import passport from "passport";
import "./passport.js";
import usersRouter from "../routes/users.routes.js";
import productsRouter from "../routes/products.routes.js";
import cartsRouter from "../routes/carts.routes.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "../middlewares/error.middlewares.js";
import viewsRouter from "../routes/views.routes.js";
import cors from "cors";

const app = express();
const server = createServer(app);
// const io = new SocketServer(server);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.use(morgan("dev"));
app.use(cookieParser());

// passport
app.use(passport.initialize());

// routes
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.use(errorMiddleware);

export default server;
