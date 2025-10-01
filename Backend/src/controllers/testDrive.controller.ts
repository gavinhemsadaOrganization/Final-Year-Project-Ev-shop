import { Request, Response } from "express";
import { ITestDriveService } from "../services/testDrive.service";
import logger from "../utils/logger";

export interface ITestDriveController {
  // Slot methods
  createSlot(req: Request, res: Response): Promise<Response>;
  getSlotById(req: Request, res: Response): Promise<Response>;
  getAllSlots(req: Request, res: Response): Promise<Response>;
  getSlotsBySeller(req: Request, res: Response): Promise<Response>;
  getActiveSlots(req: Request, res: Response): Promise<Response>;
  updateSlot(req: Request, res: Response): Promise<Response>;
  deleteSlot(req: Request, res: Response): Promise<Response>;

  // Booking methods
  createBooking(req: Request, res: Response): Promise<Response>;
  getBookingById(req: Request, res: Response): Promise<Response>;
  getBookingsByCustomer(req: Request, res: Response): Promise<Response>;
  updateBooking(req: Request, res: Response): Promise<Response>;
  deleteBooking(req: Request, res: Response): Promise<Response>;

  // Ratings
  createRating(req: Request, res: Response): Promise<Response>;
  deleteRating(req: Request, res: Response): Promise<Response>;
}

export function testDriveController(
  service: ITestDriveService
): ITestDriveController {
  return {
    // Slot methods
    createSlot: async (req, res) => {
      try {
        const result = await service.createSlot(req.body);
        if (!result.success) {
          logger.warn(`Failed to create slot: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Slot created: ${result.slot?._id}`);
        return res.status(201).json(result.slot);
      } catch (err) {
        logger.error(`Error creating slot: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    getSlotById: async (req, res) => {
      try {
        const result = await service.findSlotById(req.params.id);
        if (!result.success) {
          logger.warn(`Slot not found: ${req.params.id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Slot fetched: ${req.params.id}`);
        return res.status(200).json(result.slot);
      } catch (err) {
        logger.error(`Error fetching slot: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    getAllSlots: async (_req, res) => {
      try {
        const result = await service.findAllSlots();
        logger.info(`All slots fetched`);
        return res.status(200).json(result.slots);
      } catch (err) {
        logger.error(`Error fetching all slots: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    getSlotsBySeller: async (req, res) => {
      try {
        const result = await service.findSlotsBySeller(req.params.sellerId);
        logger.info(`Slots fetched for seller: ${req.params.sellerId}`);
        return res.status(200).json(result.slots);
      } catch (err) {
        logger.error(`Error fetching seller slots: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    getActiveSlots: async (_req, res) => {
      try {
        const result = await service.findActiveSlots();
        logger.info(`All active slots fetched`);
        return res.status(200).json(result.slots);
      } catch (err) {
        logger.error(`Error fetching all active slots: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updateSlot: async (req, res) => {
      try {
        const result = await service.updateSlot(req.params.id, req.body);
        if (!result.success) {
          logger.warn(`Slot not found for update: ${req.params.id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Slot updated: ${req.params.id}`);
        return res.status(200).json(result.slot);
      } catch (err) {
        logger.error(`Error updating slot: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    deleteSlot: async (req, res) => {
      try {
        const result = await service.deleteSlot(req.params.id);
        if (!result.success) {
          logger.warn(`Slot not found for deletion: ${req.params.id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Slot deleted: ${req.params.id}`);
        return res.status(200).json({ message: "Slot deleted" });
      } catch (err) {
        logger.error(`Error deleting slot: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    // Booking methods
    createBooking: async (req, res) => {
      try {
        const result = await service.createBooking(req.body);
        if (!result.success) {
          logger.warn(`Failed to create booking: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Booking created: ${result.booking?._id}`);
        return res.status(201).json(result.booking);
      } catch (err) {
        logger.error(`Error creating booking: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    getBookingById: async (req, res) => {
      try {
        const result = await service.findBookingById(req.params.id);
        if (!result.success) {
          logger.warn(`Booking not found: ${req.params.id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Booking fetched: ${req.params.id}`);
        return res.status(200).json(result.booking);
      } catch (err) {
        logger.error(`Error fetching booking: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    getBookingsByCustomer: async (req, res) => {
      try {
        const result = await service.findBookingsByCustomerId(
          req.params.customerId
        );
        logger.info(`Bookings fetched for customer: ${req.params.customerId}`);
        return res.status(200).json(result.bookings);
      } catch (err) {
        logger.error(`Error fetching customer bookings: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    updateBooking: async (req, res) => {
      try {
        const result = await service.updateBooking(req.params.id, req.body);
        if (!result.success) {
          logger.warn(`Booking not found for update: ${req.params.id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Booking updated: ${req.params.id}`);
        return res.status(200).json(result.booking);
      } catch (err) {
        logger.error(`Error updating booking: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    deleteBooking: async (req, res) => {
      try {
        const result = await service.deleteBooking(req.params.id);
        if (!result.success) {
          logger.warn(`Booking not found for deletion: ${req.params.id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Booking deleted: ${req.params.id}`);
        return res.status(200).json({ message: "Booking deleted" });
      } catch (err) {
        logger.error(`Error deleting booking: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    // Ratings
    createRating: async (req, res) => {
      try {
        const result = await service.createRating(req.body);
        if (!result.success) {
          logger.warn(`Failed to create rating`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Rating created`);
        return res.status(201).json(result.booking);
        } catch (err) {
        logger.error(`Error creating rating: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
        }
    },
    deleteRating: async (req, res) => {
      try {
        const result = await service.deleteRating(req.params.id);
        if (!result.success) {
          logger.warn(`Failed to delete rating`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Rating deleted`);
        return res.status(200).json({ message: "Rating deleted" });
      } catch (err) {
        logger.error(`Error deleting rating: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  };
}
