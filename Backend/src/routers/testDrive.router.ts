import { Router } from "express";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import {
  TestDriveBookingDTO,
  TestDriveSlotDTO,
  FeedbackDTO,
} from "../dtos/testDrive.DTO";
import { container } from "../di/container";
import { ITestDriveController } from "../controllers/testDrive.controller";

/**
 * Factory function that creates and configures the router for test drive-related endpoints.
 * It resolves the test drive controller from the dependency injection container and maps
 * controller methods to specific API routes for slots, bookings, and ratings.
 *
 * @returns The configured Express Router for test drives.
 */
export const testDriveRouter = (): Router => {
  const router = Router();
  // Resolve the test drive controller from the DI container.
  const controller = container.resolve<ITestDriveController>(
    "TestDriveController"
  );

  // --- Test Drive Slot Routes ---

  /**
   * @route POST /api/test-drive/slots
   * @description Creates a new test drive slot.
   * @middleware validateDto(TestDriveSlotDTO) - Validates the request body.
   * @access Private (e.g., Seller, Admin)
   */
  router.post("/slots", validateDto(TestDriveSlotDTO), (req, res) =>
    controller.createSlot(req, res)
  );

  /**
   * @route GET /api/test-drive/slots
   * @description Retrieves all available test drive slots.
   * @access Public
   */
  router.get("/slots", (req, res) => controller.getAllSlots(req, res));

  /**
   * @route GET /api/test-drive/slots/seller/:sellerId
   * @description Retrieves all test drive slots for a specific seller.
   * @access Public
   */
  router.get("/slots/seller/:sellerId", (req, res) =>
    controller.getSlotsBySeller(req, res)
  );

  /**
   * @route GET /api/test-drive/slots/active
   * @description Retrieves all currently active test drive slots.
   * @access Public
   */
  router.get("/slots/active", (req, res) =>
    controller.getActiveSlots(req, res)
  );

  /**
   * @route GET /api/test-drive/slots/:id
   * @description Retrieves a single test drive slot by its unique ID.
   * @access Public
   */
  router.get("/slots/:id", (req, res) => controller.getSlotById(req, res));

  /**
   * @route PUT /api/test-drive/slots/:id
   * @description Updates an existing test drive slot.
   * @middleware validateDto(TestDriveSlotDTO) - Validates the request body.
   * @access Private (e.g., Seller, Admin)
   */
  router.put("/slots/:id", validateDto(TestDriveSlotDTO), (req, res) =>
    controller.updateSlot(req, res)
  );

  /**
   * @route DELETE /api/test-drive/slots/:id
   * @description Deletes a test drive slot by its unique ID.
   * @access Private (e.g., Seller, Admin)
   */
  router.delete("/slots/:id", (req, res) => controller.deleteSlot(req, res));

  // --- Test Drive Booking Routes ---

  /**
   * @route POST /api/test-drive/bookings
   * @description Creates a new test drive booking.
   * @middleware validateDto(TestDriveBookingDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/bookings", validateDto(TestDriveBookingDTO), (req, res) =>
    controller.createBooking(req, res)
  );

  /**
   * @route GET /api/test-drive/bookings/customer/:customerId
   * @description Retrieves all bookings for a specific customer.
   * @access Private (Authenticated User, Admin)
   */
  router.get("/bookings/customer/:customerId", (req, res) =>
    controller.getBookingsByCustomer(req, res)
  );

  /**
   * @route GET /api/test-drive/bookings/:id
   * @description Retrieves a single test drive booking by its unique ID.
   * @access Private (Authenticated User, Admin)
   */
  router.get("/bookings/:id", (req, res) =>
    controller.getBookingById(req, res)
  );

  /**
   * @route PUT /api/test-drive/bookings/:id
   * @description Updates an existing test drive booking.
   * @middleware validateDto(TestDriveBookingDTO) - Validates the request body.
   * @access Private (Authenticated User, Admin)
   */
  router.put("/bookings/:id", validateDto(TestDriveBookingDTO), (req, res) =>
    controller.updateBooking(req, res)
  );

  /**
   * @route DELETE /api/test-drive/bookings/:id
   * @description Deletes a test drive booking by its unique ID.
   * @access Private (Authenticated User, Admin)
   */
  router.delete("/bookings/:id", (req, res) =>
    controller.deleteBooking(req, res)
  );

  // --- Test Drive Rating Routes ---

  /**
   * @route POST /api/test-drive/ratings
   * @description Creates a new rating/feedback for a completed test drive.
   * @middleware validateDto(FeedbackDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/ratings", validateDto(FeedbackDTO), (req, res) =>
    controller.createRating(req, res)
  );

  /**
   * @route PUT /api/test-drive/ratings
   * @description Updates an existing rating/feedback. (Note: Same as POST, could be consolidated)
   * @middleware validateDto(FeedbackDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.put("/ratings", validateDto(FeedbackDTO), (req, res) =>
    controller.createRating(req, res)
  );

  /**
   * @route DELETE /api/test-drive/ratings/:id
   * @description Deletes a rating by the booking ID.
   * @access Private (Authenticated User, Admin)
   */
  router.delete("/ratings/:id", (req, res) =>
    controller.deleteRating(req, res)
  );

  return router;
};
