import { container } from "tsyringe";
import {
  IMaintenanceRecordRepository,
  MaintenanceRecordRepository,
} from "../repositories/maintenanceRecord.repository";
import {
  IMaintenanceRecordService,
  maintenanceRecordService,
} from "../services/maintenanceRecord.service";
import {
  IMaintenanceRecordController,
  maintenanceRecordController,
} from "../controllers/maintenanceRecord.controller";
import { ISellerRepository } from "../repositories/seller.repository";

container.register<IMaintenanceRecordRepository>(
  "MaintenanceRecordRepository",
  {
    useValue: MaintenanceRecordRepository,
  }
);
container.register<IMaintenanceRecordService>("MaintenanceRecordService", {
  useFactory: (c) =>
    maintenanceRecordService(
      c.resolve<IMaintenanceRecordRepository>("MaintenanceRecordRepository"),
      c.resolve<ISellerRepository>("SellerRepository")
    ),
});
container.register<IMaintenanceRecordController>(
  "MaintenanceRecordController",
  {
    useFactory: (c) =>
      maintenanceRecordController(c.resolve<IMaintenanceRecordService>("MaintenanceRecordService")),
  }
);
