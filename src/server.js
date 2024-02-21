import server from "./config/app.js";
import { env } from "./utils/config.js";
import database from "./config/database.js";
import { logger } from "./utils/logger.js";

logger.info(`NODE_ENV = ${env.NODE_ENV}`);

database();
server.listen(env.PORT, () => {
  if (env.NODE_ENV === "production") {
    logger.info(`Server on port: ${env.URL}:${env.PORT}`);
  } else {
    logger.http(`Server on port: ${env.URL}:${env.PORT}`);
  }
});
