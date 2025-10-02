import { container } from "tsyringe";
import { ITestDriveRepository, TestDriveRepository } from "../repositories/testDrive.repository";
import { ITestDriveService, testDriveService } from "../services/testDrive.service";
import { ITestDriveController, testDriveController } from "../controllers/testDrive.controller";
import { ISellerRepository } from "../repositories/seller.repository";
import { IEvRepository } from "../repositories/ev.repository";

container.register<ITestDriveRepository>("TestDriveRepository", {
  useValue: TestDriveRepository,
});

container.register<ITestDriveService>("TestDriveService", {
  useFactory: (c) => testDriveService(
    c.resolve<ITestDriveRepository>("TestDriveRepository"),
    c.resolve<ISellerRepository>("SellerRepository"),
    c.resolve<IEvRepository>("EvRepository")
  ),
});

container.register<ITestDriveController>("TestDriveController", {
  useFactory: (c) => testDriveController(c.resolve<ITestDriveService>("TestDriveService")),
});

export { container };