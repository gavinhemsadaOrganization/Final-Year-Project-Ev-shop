import { Router } from "express";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import {
  MaintenanceRecordDTO,
  UpdateMaintenanceRecordDTO,
} from "../dtos/maintenanceRecord.DTO";
import { IMaintenanceRecordController } from "../controllers/maintenanceRecord.controller";
import "../di/maintenanceRecord.di";

export const maintenanceRecordRouter = (): Router => {
  const router = Router();
  const controller = container.resolve<IMaintenanceRecordController>(
    "MaintenanceRecordController"
  );

  router.post("/", validateDto(MaintenanceRecordDTO), (req, res) =>
    controller.createRecord(req, res)
  );
  router.get("/", (req, res) => controller.getAllRecords(req, res));
  router.get("/seller/:sellerId", (req, res) =>
    controller.getRecordsBySellerId(req, res)
  );
  router.get("/:id", (req, res) => controller.getRecordById(req, res));
  router.put(
    "/:id",
    validateDto(UpdateMaintenanceRecordDTO),
    (req, res) => controller.updateRecord(req, res)
  );
  router.delete("/:id", (req, res) => controller.deleteRecord(req, res));

  return router;
};
