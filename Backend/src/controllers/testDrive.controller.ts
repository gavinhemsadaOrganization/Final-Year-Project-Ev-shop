import { Request, Response } from "express";
import { ITestDriveService } from "../services/testDrive.service";
import { handleResult, handleError } from "../utils/Respons.util";

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
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "creating slot");
      }
    },

    getSlotById: async (req, res) => {
      try {
        const result = await service.findSlotById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching slot by id");
      }
    },

    getAllSlots: async (_req, res) => {
      try {
        const result = await service.findAllSlots();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching all slots");
      }
    },

    getSlotsBySeller: async (req, res) => {
      try {
        const result = await service.findSlotsBySeller(req.params.sellerId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching slots by seller");
      }
    },
    getActiveSlots: async (_req, res) => {
      try {
        const result = await service.findActiveSlots();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching active slots");
      }
    },
    updateSlot: async (req, res) => {
      try {
        const result = await service.updateSlot(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updating slot");
      }
    },

    deleteSlot: async (req, res) => {
      try {
        const result = await service.deleteSlot(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleting slot");
      }
    },

    // Booking methods
    createBooking: async (req, res) => {
      try {
        const result = await service.createBooking(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "creating booking");
      }
    },

    getBookingById: async (req, res) => {
      try {
        const result = await service.findBookingById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching booking by id");
      }
    },

    getBookingsByCustomer: async (req, res) => {
      try {
        const result = await service.findBookingsByCustomerId(req.params.customerId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching bookings by customer");
      }
    },

    updateBooking: async (req, res) => {
      try {
        const result = await service.updateBooking(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updating booking");
      }
    },

    deleteBooking: async (req, res) => {
      try {
        const result = await service.deleteBooking(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleting booking");
      }
    },
    // Ratings
    createRating: async (req, res) => {
      try {
        const result = await service.createRating(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "creating rating");
      }
    },
    deleteRating: async (req, res) => {
      try {
        const result = await service.deleteRating(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleting rating");
      }
    }
  };
}
