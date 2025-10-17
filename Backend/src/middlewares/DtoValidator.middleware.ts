import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/**
 * A higher-order function that creates a validation middleware for Express.
 * This middleware validates and transforms the request body against a given DTO class.
 *
 * @param DtoClass - The DTO class (e.g., `UserDTO`, `ProductDTO`) to validate against.
 * @returns An Express middleware function.
 */
export const validateDto =
  (DtoClass: any) =>
  /**
   * The actual middleware function that will be executed by Express.
   * It performs the following steps:
   * 1. Pre-parses stringified JSON in the request body (for multipart/form-data).
   * 2. Transforms the plain request body object into an instance of the DTO class.
   * 3. Validates the DTO instance against the rules defined in the class.
   * 4. If validation fails, it sends a 400 response with detailed errors.
   * 5. If validation succeeds, it replaces `req.body` with the validated DTO instance and passes control to the next middleware.
   */
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Step 1: Handle stringified JSON fields.
      // This is crucial for `multipart/form-data` requests where complex objects
      // are often sent as JSON strings alongside files.
      for (const key of Object.keys(req.body)) {
        const value = req.body[key];
        if (typeof value === "string") {
          const trimmed = value.trim();
          // Check if the string looks like a JSON object or array.
          if (
            (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
            (trimmed.startsWith("[") && trimmed.endsWith("]"))
          ) {
            try {
              // Attempt to parse the string into a JavaScript object.
              req.body[key] = JSON.parse(trimmed);
            } catch (err) {
              // If parsing fails, log a warning but don't block the request.
              // The validation step will likely catch this as a type mismatch.
              logger.warn(
                `Skipping parse for key "${key}": invalid JSON string`
              );
            }
          }
        }
      }

      // Step 2: Transform the plain JavaScript object from `req.body` into an instance of the DTO class.
      // This is necessary for `class-validator` to apply the validation decorators.
      const dtoObject = plainToInstance(DtoClass, req.body, {
        enableImplicitConversion: true,
      });

      // Step 3: Validate the transformed object.
      const errors = await validate(dtoObject, {
        whitelist: true, // Automatically remove properties that do not have any decorators.
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present.
      });

      // Step 4: Handle validation errors.
      if (errors.length > 0) {
        logger.error(`Validation errors: ${JSON.stringify(errors, null, 2)}`);
        return res.status(400).json({
          message: "Validation failed",
          // Map errors to a more client-friendly format.
          errors: errors.map((err) => ({
            field: err.property,
            constraints: err.constraints,
          })),
        });
      }

      // Step 5: If validation is successful, replace the original `req.body` with the validated and transformed DTO object.
      // This provides sanitized and typed data to the subsequent route handlers.
      req.body = dtoObject;
      next();
    } catch (error) {
      logger.error(`DTO validation middleware error: ${error}`);
      return res.status(500).json({ message: "Validation middleware failed" });
    }
  };
