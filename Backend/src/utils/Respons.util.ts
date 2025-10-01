import logger from "../utils/logger";
import { Response } from "express";

export const handleResult = (
  res: Response,
  result: { success: boolean; [key: string]: any; error?: string },
  successStatus: number = 200
) => {
  if (!result.success) {
    const statusCode = result.error?.includes("not found") ? 404 : 400;
    logger.warn(result.error);
    return res.status(statusCode).json({ message: result.error });
  }
  const dataKey = Object.keys(result).find(
    (k) => k !== "success" && k !== "error"
  );
  logger.info(`Operation successful. Data key: ${dataKey}`);
  return res
    .status(successStatus)
    .json(dataKey ? result[dataKey] : { message: "Operation successful" });
};

export const handleError = (
  res: Response,
  error: unknown,
  operation: string
) => {
  logger.error(`Error during ${operation}: ${error}`);
  return res.status(500).json({ message: "Internal server error" });
};
