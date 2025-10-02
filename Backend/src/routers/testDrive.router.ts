import { Router } from "express";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import {
  TestDriveBookingDTO,
  TestDriveSlotDTO,
  FeedbackDTO,
} from "../dtos/testDrive.DTO";
import { container } from "../di/testDrive.di";
import { ITestDriveController } from "../controllers/testDrive.controller";

export const testDriveRouter = (): Router => {
  const router = Router();
  const controller = container.resolve<ITestDriveController>(
    "TestDriveController"
  );

  // slots
  router.post("/slots", validateDto(TestDriveSlotDTO), (req, res) =>
    controller.createSlot(req, res)
  );
 
  router.get("/slots", (req, res) => controller.getAllSlots(req, res));
 
  router.get("/slots/seller/:sellerId", (req, res) =>
    controller.getSlotsBySeller(req, res)
  );
 
  router.get("/slots/:id", (req, res) => controller.getSlotById(req, res));

  router.get("/slots/active", (req, res) =>
    controller.getActiveSlots(req, res)
  );
 
  router.put("/slots/:id", validateDto(TestDriveSlotDTO), (req, res) =>
    controller.updateSlot(req, res)
  );
 
  router.delete("/slots/:id", (req, res) => controller.deleteSlot(req, res));

  // booking
  router.post("/bookings", validateDto(TestDriveBookingDTO), (req, res) =>
    controller.createBooking(req, res)
  );
 
  router.get("/bookings/customer/:customerId", (req, res) =>
    controller.getBookingsByCustomer(req, res)
  );
  
  router.get("/bookings/:id", (req, res) =>
    controller.getBookingById(req, res)
  );
 
  router.put("/bookings/:id", validateDto(TestDriveBookingDTO), (req, res) =>
    controller.updateBooking(req, res)
  );
 
  router.delete("/bookings/:id", (req, res) =>
    controller.deleteBooking(req, res)
  );

  router.post("/ratings", validateDto(FeedbackDTO), (req, res) =>
    controller.createRating(req, res)
  );
 
  router.put("/ratings", validateDto(FeedbackDTO), (req, res) =>
    controller.createRating(req, res)
  );
  
  router.delete("/ratings/:id", (req, res) =>
    controller.deleteRating(req, res)
  );

  return router;
};
