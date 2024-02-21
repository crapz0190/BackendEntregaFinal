import { __dirname } from "../utils/config.js";
import multer from "multer";
import { extname, join } from "node:path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profiles") {
      cb(null, join(__dirname, "public", "profiles"));
    } else if (file.fieldname === "products") {
      cb(null, join(__dirname, "public", "products"));
    } else {
      cb(null, join(__dirname, "public", "documents"));
    }
  },
  filename: function (req, file, cb) {
    // extrae la extencion del archivo
    let ext = extname(file.originalname).toLocaleLowerCase();
    // le paso la extencion al uuid
    cb(null, uuidv4() + ext);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|docx|doc|txt|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const ext = filetypes.test(extname(file.originalname));

    if (mimetype && ext) {
      return cb(null, true);
    }
    cb(new Error("Only jpeg, jpg, png & webp file supported!"));
  },
});
