import __dirname from "./index.js";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API",
      version: "1.0.0",
      description: "A simple API to manage users",
    },
  },
  apis: [`${__dirname}/../docs/**/*.yaml`],
};
