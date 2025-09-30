import {
  TestDriveBookingDTO,
  TestDriveSlotDTO
} from "../dtos/testDrive.DTO";
import { ITestDriveRepository } from "../repositories/testDrive.repository";

export interface ITestDriveService {
  // Slot methods
  createSlot(
    data: TestDriveSlotDTO
  ): Promise<{ success: boolean; slot?: any; error?: string }>;
  findSlotById(
    id: string
  ): Promise<{ success: boolean; slot?: any; error?: string }>;
  findAllSlots(): Promise<{ success: boolean; slots?: any[]; error?: string }>;
  findSlotsBySeller(
    sellerId: string
  ): Promise<{ success: boolean; slots?: any[]; error?: string }>;
  updateSlot(
    id: string,
    data: Partial<TestDriveSlotDTO>
  ): Promise<{ success: boolean; slot?: any; error?: string }>;
  deleteSlot(id: string): Promise<{ success: boolean; error?: string }>;

  // Booking methods
  createBooking(
    data: TestDriveBookingDTO
  ): Promise<{ success: boolean; booking?: any; error?: string }>;
  findBookingById(
    id: string
  ): Promise<{ success: boolean; booking?: any; error?: string }>;
  findBookingsByCustomerId(
    customerId: string
  ): Promise<{ success: boolean; bookings?: any[]; error?: string }>;
  updateBooking(
    id: string,
    data: Partial<TestDriveBookingDTO>
  ): Promise<{ success: boolean; booking?: any; error?: string }>;
  deleteBooking(id: string): Promise<{ success: boolean; error?: string }>;
}

export function testDriveService(
  testDriveRepo: ITestDriveRepository
): ITestDriveService {
  return {
    // Slot methods
    createSlot: async (data) => {
      try {
        const slot = await testDriveRepo.createSlot(data);
        return { success: true, slot };
      } catch (err) {
        return { success: false, error: "Failed to create slot" };
      }
    },
    findSlotById: async (id) => {
      try {
        const slot = await testDriveRepo.findSlotById(id);
        if (!slot) return { success: false, error: "Slot not found" };
        return { success: true, slot };
      } catch (err) {
        return { success: false, error: "Failed to fetch slot" };
      }
    },
    findAllSlots: async () => {
      try {
        const slots = await testDriveRepo.findAllSlots();
        return { success: true, slots };
      } catch (err) {
        return { success: false, error: "Failed to fetch slots" };
      }
    },
    findSlotsBySeller: async (sellerId) => {
      try {
        const slots = await testDriveRepo.findSlotsBySeller(sellerId);
        return { success: true, slots };
      } catch (err) {
        return { success: false, error: "Failed to fetch slots for seller" };
      }
    },
    updateSlot: async (id, data) => {
      try {
        const slot = await testDriveRepo.updateSlot(id, data);
        if (!slot) return { success: false, error: "Slot not found" };
        return { success: true, slot };
      } catch (err) {
        return { success: false, error: "Failed to update slot" };
      }
    },
    deleteSlot: async (id) => {
      try {
        const success = await testDriveRepo.deleteSlot(id);
        if (!success) return { success: false, error: "Slot not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete slot" };
      }
    },

    // Booking methods
    createBooking: async (data) => {
      try {
        const slot = await testDriveRepo.findSlotById(data.slot_id);
        if (!slot) return { success: false, error: "Slot not found" };

        const bookingsOnSlot = await testDriveRepo.findBookingsBySlotId(
          data.slot_id
        );
        if (bookingsOnSlot.length >= slot.max_bookings) {
          return { success: false, error: "Slot is fully booked" };
        }

        const bookingData = {
          ...data,
          booking_date: slot.available_date,
          status: "confirmed",
        };
        const booking = await testDriveRepo.createBooking(bookingData as any);
        return { success: true, booking };
      } catch (err) {
        return { success: false, error: "Failed to create booking" };
      }
    },
    findBookingById: async (id) => {
      try {
        const booking = await testDriveRepo.findBookingById(id);
        if (!booking) return { success: false, error: "Booking not found" };
        return { success: true, booking };
      } catch (err) {
        return { success: false, error: "Failed to fetch booking" };
      }
    },
    findBookingsByCustomerId: async (customerId) => {
      try {
        const bookings = await testDriveRepo.findBookingsByCustomerId(
          customerId
        );
        return { success: true, bookings };
      } catch (err) {
        return { success: false, error: "Failed to fetch bookings" };
      }
    },
    updateBooking: async (id, data) => {
      try {
        const booking = await testDriveRepo.updateBooking(id, data);
        if (!booking) return { success: false, error: "Booking not found" };
        return { success: true, booking };
      } catch (err) {
        return { success: false, error: "Failed to update booking" };
      }
    },
    deleteBooking: async (id) => {
      try {
        const success = await testDriveRepo.deleteBooking(id);
        if (!success) return { success: false, error: "Booking not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete booking" };
      }
    },
  };
}
