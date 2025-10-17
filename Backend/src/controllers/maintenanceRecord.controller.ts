import { Request, Response } from "express";
import { IMaintenanceRecordService } from "../services/maintenanceRecord.service";
import { handleResult, handleError } from "../utils/Respons.util";

/**
 * Defines the contract for the maintenance record controller, specifying methods for handling HTTP requests related to maintenance records.
 */
export interface IMaintenanceRecordController {
  /**
   * Handles the HTTP request to create a new maintenance record.
   * @param req - The Express request object, containing record data in the body.
   * @param res - The Express response object.
   */
  createRecord(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to get a maintenance record by its unique ID.
   * @param req - The Express request object, containing the record ID in `req.params`.
   * @param res - The Express response object.
   */
  getRecordById(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to get all maintenance records for a specific seller.
   * @param req - The Express request object, containing the seller ID in `req.params`.
   * @param res - The Express response object.
   */
  getRecordsBySellerId(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to retrieve all maintenance records.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  getAllRecords(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to update an existing maintenance record.
   * @param req - The Express request object, containing the record ID and update data.
   * @param res - The Express response object.
   */
  updateRecord(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to delete a maintenance record.
   * @param req - The Express request object, containing the record ID in `req.params`.
   * @param res - The Express response object.
   */
  deleteRecord(req: Request, res: Response): Promise<Response>;
}

/**
 * Factory function to create an instance of the maintenance record controller.
 * It encapsulates the logic for handling API requests related to maintenance records.
 *
 * @param service - The maintenance record service dependency that contains the business logic.
 * @returns An implementation of the IMaintenanceRecordController interface.
 */
export function maintenanceRecordController(
  service: IMaintenanceRecordService
): IMaintenanceRecordController {
  return {
    /**
     * Creates a new maintenance record.
     */
    createRecord: async (req, res) => {
      try {
        const result = await service.createRecord(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createRecord");
      }
    },
    /**
     * Retrieves a single maintenance record by its ID.
     */
    getRecordById: async (req, res) => {
      try {
        const result = await service.getRecordById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getRecordById");
      }
    },
    /**
     * Retrieves all maintenance records associated with a specific seller.
     */
    getRecordsBySellerId: async (req, res) => {
      try {
        const result = await service.getRecordsBySellerId(req.params.sellerId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getRecordsBySellerId");
      }
    },
    /**
     * Retrieves a list of all maintenance records.
     */
    getAllRecords: async (_req, res) => {
      try {
        const result = await service.getAllRecords();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllRecords");
      }
    },
    /**
     * Updates an existing maintenance record.
     */
    updateRecord: async (req, res) => {
      try {
        const result = await service.updateRecord(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateRecord");
      }
    },
    /**
     * Deletes a maintenance record by its ID.
     */
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
