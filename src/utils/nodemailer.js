import nodemailer from "nodemailer";
import { env } from "./config.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.NODEMAILER_USER,
    pass: env.NODEMAILER_PASSWORD,
  },
});
