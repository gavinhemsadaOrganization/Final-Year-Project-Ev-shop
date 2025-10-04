// import { plainToInstance } from "class-transformer";
// import { validate } from "class-validator";
// import { Request, Response, NextFunction } from "express";
// import logger from "../utils/logger";

// export const validateDto =
//   (DtoClass: any) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     if (req.body.address && typeof req.body.address === "string") {
//       try {
//         req.body.address = JSON.parse(req.body.address);
//       } catch (err) {
//         logger.error(`Error parsing address JSON: ${err}`);
//         return res.status(400).json({ message: "Invalid address JSON" });
//       }
//     }

//     const dtoObject = plainToInstance(DtoClass, req.body, {
//       enableImplicitConversion: true,
//     });
//     const errors = await validate(dtoObject, {
//       whitelist: true,
//       forbidNonWhitelisted: true,
//     });

//     if (errors.length > 0) {
//       logger.error(`Validation errors: ${JSON.stringify(errors)}`);
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: errors.map((err) => ({
//           field: err.property,
//           constraints: err.constraints,
//         })),
//       });
//     }

//     req.body = dtoObject;
//     next();
//   };

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const validateDto =
  (DtoClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 🔹 Handle any stringified nested JSON fields (common in multipart/form-data)
      for (const key of Object.keys(req.body)) {
        const value = req.body[key];
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (
            (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
            (trimmed.startsWith("[") && trimmed.endsWith("]"))
          ) {
            try {
              req.body[key] = JSON.parse(trimmed);
            } catch (err) {
              logger.warn(`Skipping parse for key "${key}": invalid JSON string`);
            }
          }
        }
      }

      // 🔹 Transform plain object into DTO
      const dtoObject = plainToInstance(DtoClass, req.body, {
        enableImplicitConversion: true,
      });

      // 🔹 Validate DTO
      const errors = await validate(dtoObject, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        logger.error(`Validation errors: ${JSON.stringify(errors, null, 2)}`);
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.map((err) => ({
            field: err.property,
            constraints: err.constraints,
          })),
        });
      }

      req.body = dtoObject;
      next();
    } catch (error) {
      logger.error(`DTO validation middleware error: ${error}`);
      return res.status(500).json({ message: "Validation middleware failed" });
    }
  };
