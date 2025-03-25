import { option } from "../config/commander.js";
import winston from "winston";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

const loggerProduction = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "warn",
    }),
  ],
});

const loggerDevelopment = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export const logger =
  option.logger === "PRODUCTION" ? loggerProduction : loggerDevelopment;
