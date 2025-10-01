// src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "EV Shop API",
      version: "1.0.0",
      description: "API documentation for EV Shop backend",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1", // your API base url
      },
    ],
  },
  apis: ["./src/routers/*.ts", "./src/dtos/*.ts"], // path to your API routes/doc comments
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
};
