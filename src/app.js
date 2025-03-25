import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import { swaggerOptions } from "./utils/swagger.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";

const app = express();
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Conectado a la base de datos"))
  .catch((err) => {
    logger.fatal("No se pudo conectar a la base de datos", err);
    process.exit(1);
  });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const spec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("¡Algo se rompió!");
});

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));
