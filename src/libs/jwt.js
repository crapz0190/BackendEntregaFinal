import jwt from "jsonwebtoken";
import { env } from "../utils/config.js";

export function createAccessToken(payload) {
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      env.TOKEN_SECRET_JWT,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) rej(err);
        res(token);
      },
    );
  });
}
