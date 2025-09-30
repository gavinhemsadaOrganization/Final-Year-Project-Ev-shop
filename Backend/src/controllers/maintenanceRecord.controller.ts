import { Request, Response } from "express";
import { IMaintenanceRecordService } from "../services/maintenanceRecord.service";
import logger from "../utils/logger";

export interface IMaintenanceRecordController {
  createRecord(req: Request, res: Response): Promise<Response>;
  getRecordById(req: Request, res: Response): Promise<Response>;
  getRecordsBySellerId(req: Request, res: Response): Promise<Response>;
  getAllRecords(req: Request, res: Response): Promise<Response>;
  updateRecord(req: Request, res: Response): Promise<Response>;
  deleteRecord(req: Request, res: Response): Promise<Response>;
}

export function maintenanceRecordController(
  service: IMaintenanceRecordService
): IMaintenanceRecordController {
  const handleResult = (
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

  const handleError = (res: Response, error: unknown, operation: string) => {
    logger.error(`Error during ${operation}: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  };

  return {
    createRecord: async (req, res) => {
      try {
        const result = await service.createRecord(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createRecord");
      }
    },
    getRecordById: async (req, res) => {
      try {
        const result = await service.getRecordById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getRecordById");
      }
    },
    getRecordsBySellerId: async (req, res) => {
      try {
        const result = await service.getRecordsBySellerId(req.params.sellerId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getRecordsBySellerId");
      }
    },
    getAllRecords: async (_req, res) => {
      try {
        const result = await service.getAllRecords();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllRecords");
      }
    },
    updateRecord: async (req, res) => {
      try {
        const result = await service.updateRecord(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateRecord");
      }
    },
    deleteRecord: async (req, res) => {
      try {
        const result = await service.deleteRecord(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteRecord");
      }
    },
  };
}
