import { Router } from "express";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import {
  MaintenanceRecordDTO,
  UpdateMaintenanceRecordDTO,
} from "../dtos/maintenanceRecord.DTO";
import { IMaintenanceRecordController } from "../controllers/maintenanceRecord.controller";
import "../di/maintenanceRecord.di";

/**
 * Factory function that creates and configures the router for maintenance record-related endpoints.
 * It resolves the maintenance record controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for maintenance record management.
 */
export const maintenanceRecordRouter = (): Router => {
  const router = Router();
  // Resolve the maintenance record controller from the DI container.
  const controller = container.resolve<IMaintenanceRecordController>(
    "MaintenanceRecordController"
  );

  /**
   * @route POST /api/maintenance-records/
   * @description Creates a new maintenance record.
   * @middleware validateDto(MaintenanceRecordDTO) - Validates the request body.
   * @access Private (e.g., Seller, Admin)
   */
  router.post("/", validateDto(MaintenanceRecordDTO), (req, res) =>
    controller.createRecord(req, res)
  );

  /**
   * @route GET /api/maintenance-records/
   * @description Retrieves a list of all maintenance records.
   * @access Private (Typically restricted to Admins)
   */
  router.get("/", (req, res) => controller.getAllRecords(req, res));

  /**
   * @route GET /api/maintenance-records/seller/:sellerId
   * @description Retrieves all maintenance records for a specific seller.
   * @access Public
   */
  router.get("/seller/:sellerId", (req, res) =>
    controller.getRecordsBySellerId(req, res)
  );

  /**
   * @route GET /api/maintenance-records/:id
   * @description Retrieves a single maintenance record by its unique ID.
   * @access Public
   */
  router.get("/:id", (req, res) => controller.getRecordById(req, res));

  /**
   * @route PUT /api/maintenance-records/:id
   * @description Updates an existing maintenance record.
   * @middleware validateDto(UpdateMaintenanceRecordDTO) - Validates the request body.
   * @access Private (e.g., Seller, Admin)
   */
  router.put("/:id", validateDto(UpdateMaintenanceRecordDTO), (req, res) =>
    controller.updateRecord(req, res)
  );

  /**
   * @route DELETE /api/maintenance-records/:id
   * @description Deletes a maintenance record by its unique ID.
   * @access Private (e.g., Seller, Admin)
   */
  router.delete("/:id", (req, res) => controller.deleteRecord(req, res));

  return router;
};
