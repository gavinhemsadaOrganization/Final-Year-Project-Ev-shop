import { container } from "tsyringe";
import { ITestDriveRepository, TestDriveRepository } from "../repositories/testDrive.repository";
import { ITestDriveService, testDriveService } from "../services/testDrive.service";
import { ITestDriveController, testDriveController } from "../controllers/testDrive.controller";

container.register<ITestDriveRepository>("ITestDriveRepository", {
  useValue: TestDriveRepository,
});

container.register<ITestDriveService>("ITestDriveService", {
  useFactory: (c) => testDriveService(c.resolve<ITestDriveRepository>("ITestDriveRepository")),
});

container.register<ITestDriveController>("ITestDriveController", {
  useFactory: (c) => testDriveController(c.resolve<ITestDriveService>("ITestDriveService")),
});

export { container };