import mongoose from "mongoose";
import { env } from "../utils/config.js";
import { logger } from "../utils/logger.js";

const mongoDB = async () => {
  try {
    await mongoose.connect(env.URI_MONGO);
    logger.info(">> DB is connected <<");
  } catch (e) {
    logger.fatal("Error connecting to mongo DB");
  }
};

export default mongoDB;
