import logger from "../utils/logger";
import { Response } from "express";

/**
 * Handles the standard response for a service layer result.
 * It checks the `success` property of the result object and sends an appropriate
 * HTTP response.
 *
 * - If `result.success` is `false`, it sends a 400 or 404 status with an error message.
 * - If `result.success` is `true`, it sends a success status (default 200) and unwraps the data.
 *
 * The function intelligently finds the data key in the result object (e.g., 'user', 'products')
 * and returns that as the JSON payload. If no data key is found, it returns a generic success message.
 *
 * @param res - The Express response object.
 * @param result - The result object from a service call, which must include a `success` boolean property.
 * @param successStatus - The HTTP status code to send on success. Defaults to 200.
 * @returns The Express response object with the status and JSON payload set.
 */
export const handleResult = (
  res: Response,
  result: { success: boolean; [key: string]: any; error?: string },
  successStatus: number = 200
) => {
  // Check if the service operation was unsuccessful.
  if (!result.success) {
    // Determine the status code: 404 for "not found" errors, 400 for other client-side errors.
    const statusCode = result.error?.includes("not found") ? 404 : 400;
    logger.warn(result.error);
    return res.status(statusCode).json({ message: result.error });
  }

  // On success, find the key in the result object that contains the actual data.
  // This avoids returning the `{ success: true, data: [...] }` wrapper.
  const dataKey = Object.keys(result).find(
    (k) => k !== "success" && k !== "error"
  );
  logger.info(`Operation successful. Data key: ${dataKey}`);

  // Send the success response.
  // If a data key was found, return the data under that key.
  // Otherwise, return a generic success message.
  return res
    .status(successStatus)
    .json(dataKey ? result[dataKey] : { message: "Operation successful" });
};

/**
 * Handles unexpected, critical errors that occur within a controller's try-catch block.
 * This function logs the error for debugging purposes and sends a generic 500 Internal Server Error
 * response to the client, preventing sensitive error details from being exposed.
 *
 * @param res - The Express response object.
 * @param error - The caught error object (of type `unknown`).
 * @param operation - A string describing the operation that failed (e.g., "create user").
 * @returns The Express response object with a 500 status and a generic error message.
 */
export const handleError = (
  res: Response,
  error: unknown,
  operation: string
) => {
  logger.error(`Error during ${operation}: ${error}`);
  return res.status(500).json({ message: "Internal server error" });
};
