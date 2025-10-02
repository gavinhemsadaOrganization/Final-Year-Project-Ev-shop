import { Request, Response } from "express";
import { IMaintenanceRecordService } from "../services/maintenanceRecord.service";
import { handleResult, handleError } from "../utils/Respons.util";

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
