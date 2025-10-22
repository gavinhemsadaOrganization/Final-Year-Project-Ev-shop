import { Router } from "express";
import { validateDto } from "../../shared/middlewares/DtoValidator.middleware";
import {
  MaintenanceRecordDTO,
  UpdateMaintenanceRecordDTO,
} from "../../dtos/maintenanceRecord.DTO";
import { IMaintenanceRecordController } from "./maintenanceRecord.controller";
import { container } from "../../di/container";

/**
 * Factory function that creates and configures the router for maintenance record-related endpoints.
 * It resolves the maintenance record controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for maintenance record management.
 */
/**
 * @swagger
 * tags:
 *   name: Maintenance Records
 *   description: Operations related to vehicle maintenance records
 */
export const maintenanceRecordRouter = (): Router => {
  const router = Router();
  // Resolve the maintenance record controller from the DI container.
  const controller = container.resolve<IMaintenanceRecordController>(
    "MaintenanceRecordController"
  );

  /**
   * @swagger
   * /maintenance-records:
   *   post:
   *     summary: Create a new maintenance record
   *     description: Creates a new maintenance record for a vehicle. Requires seller or admin privileges.
   *     tags: [Maintenance Records]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MaintenanceRecordDTO'
   *     responses:
   *       '201':
   *         description: Maintenance record created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean, example: true }
   *                 record: { type: object } # Ideally $ref to a MaintenanceRecord schema
   *       '400':
   *         description: Bad request (validation error, seller not found).
   *         $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized.
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not seller or admin).
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error.
   *         $ref: '#/components/schemas/Error'
   */
  router.post("/", validateDto(MaintenanceRecordDTO), (req, res) =>
    controller.createRecord(req, res)
  );

  /**
   * @swagger
   * /maintenance-records:
   *   get:
   *     summary: Get all maintenance records
   *     description: Retrieves a list of all maintenance records. Typically restricted to Admins.
   *     tags: [Maintenance Records]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: A list of all maintenance records.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean, example: true }
   *                 records: { type: array, items: { type: object } } # Ideally $ref to a MaintenanceRecord schema
   *       '401':
   *         description: Unauthorized.
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not admin).
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error.
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/", (req, res) => controller.getAllRecords(req, res));

  /**
   * @swagger
   * /maintenance-records/seller/{sellerId}:
   *   get:
   *     summary: Get maintenance records by seller ID
   *     description: Retrieves all maintenance records associated with a specific seller.
   *     tags: [Maintenance Records]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sellerId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the seller whose records are to be retrieved.
   *     responses:
   *       '200':
   *         description: A list of maintenance records for the specified seller.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean, example: true }
   *                 records: { type: array, items: { type: object } } # Ideally $ref to a MaintenanceRecord schema
   *       '401':
   *         description: Unauthorized.
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not the seller or admin).
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Seller not found or no records for this seller.
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error.
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/seller/:sellerId", (req, res) =>
    controller.getRecordsBySellerId(req, res)
  );

  /**
   * @swagger
   * /maintenance-records/{id}:
   *   get:
   *     summary: Get maintenance record by ID
   *     description: Retrieves a single maintenance record by its unique ID.
   *     tags: [Maintenance Records]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the maintenance record to retrieve.
   *     responses:
   *       '200':
   *         description: Maintenance record details.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean, example: true }
   *                 record: { type: object } # Ideally $ref to a MaintenanceRecord schema
   *       '401':
   *         description: Unauthorized.
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not the owner, seller, or admin).
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Maintenance record not found.
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error.
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/:id", (req, res) => controller.getRecordById(req, res));

  /**
   * @swagger
   * /maintenance-records/{id}:
   *   put:
   *     summary: Update a maintenance record
   *     description: Updates an existing maintenance record. Requires seller or admin privileges.
   *     tags: [Maintenance Records]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the maintenance record to update.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateMaintenanceRecordDTO'
   *     responses:
   *       '200':
   *         description: Maintenance record updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean, example: true }
   *                 record: { type: object } # Ideally $ref to a MaintenanceRecord schema
   *       '400':
   *         description: Bad request (validation error).
   *         $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized.
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not the owner, seller, or admin).
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Maintenance record not found.
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error.
   *         $ref: '#/components/schemas/Error'
   */
  router.put("/:id", validateDto(UpdateMaintenanceRecordDTO), (req, res) =>
    controller.updateRecord(req, res)
  );

  /**
   * @swagger
   * /maintenance-records/{id}:
   *   delete:
   *     summary: Delete a maintenance record
   *     description: Deletes a maintenance record by its unique ID. Requires seller or admin privileges.
   *     tags: [Maintenance Records]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the maintenance record to delete.
   *     responses:
   *       '200':
   *         description: Maintenance record deleted successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean, example: true }
   *                 message: { type: string, example: "Maintenance record deleted successfully" }
   *       '401':
   *         description: Unauthorized.
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not the owner, seller, or admin).
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Maintenance record not found.
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error.
   *         $ref: '#/components/schemas/Error'
   */
  router.delete("/:id", (req, res) => controller.deleteRecord(req, res));

  return router;
};
