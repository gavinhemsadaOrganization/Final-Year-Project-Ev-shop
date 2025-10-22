import {
  TestDriveBookingDTO,
  TestDriveSlotDTO,
  FeedbackDTO,
} from "../../dtos/testDrive.DTO";
import { ITestDriveRepository } from "./testDrive.repository";
import { ISellerRepository } from "../seller/seller.repository";
import { IEvRepository } from "../ev/ev.repository";
import { TestDriveBookingStatus } from "../../shared/enum/enum";
import CacheService from "../../shared/cache/CacheService";

/**
 * Defines the interface for the test drive service, outlining the methods for managing test drive slots, bookings, and feedback.
 */
export interface ITestDriveService {
  // Slot methods
  /**
   * Creates a new test drive slot.
   * @param data - The data for the new slot.
   * @returns A promise that resolves to an object containing the created slot or an error.
   */
  createSlot(
    data: TestDriveSlotDTO
  ): Promise<{ success: boolean; slot?: any; error?: string }>;
  /**
   * Finds a test drive slot by its unique ID.
   * @param id - The ID of the slot to find.
   * @returns A promise that resolves to an object containing the slot data or an error.
   */
  findSlotById(
    id: string
  ): Promise<{ success: boolean; slot?: any; error?: string }>;
  /**
   * Retrieves all test drive slots.
   * @returns A promise that resolves to an object containing an array of all slots or an error.
   */
  findAllSlots(): Promise<{ success: boolean; slots?: any[]; error?: string }>;
  /**
   * Finds all test drive slots offered by a specific seller.
   * @param sellerId - The ID of the seller.
   * @returns A promise that resolves to an object containing an array of the seller's slots or an error.
   */
  findSlotsBySeller(
    sellerId: string
  ): Promise<{ success: boolean; slots?: any[]; error?: string }>;
  /**
   * Retrieves all currently active test drive slots.
   * @returns A promise that resolves to an object containing an array of active slots or an error.
   */
  findActiveSlots(): Promise<{
    success: boolean;
    slots?: any[];
    error?: string;
  }>;
  /**
   * Updates an existing test drive slot.
   * @param id - The ID of the slot to update.
   * @param data - The partial data to update the slot with.
   * @returns A promise that resolves to an object containing the updated slot data or an error.
   */
  updateSlot(
    id: string,
    data: Partial<TestDriveSlotDTO>
  ): Promise<{ success: boolean; slot?: any; error?: string }>;
  /**
   * Deletes a test drive slot by its unique ID.
   * @param id - The ID of the slot to delete.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  deleteSlot(id: string): Promise<{ success: boolean; error?: string }>;

  // Booking methods
  /**
   * Creates a new test drive booking.
   * @param data - The data for the new booking.
   * @returns A promise that resolves to an object containing the created booking or an error.
   */
  createBooking(
    data: TestDriveBookingDTO
  ): Promise<{ success: boolean; booking?: any; error?: string }>;
  /**
   * Finds a test drive booking by its unique ID.
   * @param id - The ID of the booking to find.
   * @returns A promise that resolves to an object containing the booking data or an error.
   */
  findBookingById(
    id: string
  ): Promise<{ success: boolean; booking?: any; error?: string }>;
  /**
   * Finds all test drive bookings made by a specific customer.
   * @param customerId - The ID of the customer.
   * @returns A promise that resolves to an object containing an array of the customer's bookings or an error.
   */
  findBookingsByCustomerId(
    customerId: string
  ): Promise<{ success: boolean; bookings?: any[]; error?: string }>;
  /**
   * Updates an existing test drive booking.
   * @param id - The ID of the booking to update.
   * @param data - The partial data to update the booking with.
   * @returns A promise that resolves to an object containing the updated booking data or an error.
   */
  updateBooking(
    id: string,
    data: Partial<TestDriveBookingDTO>
  ): Promise<{ success: boolean; booking?: any; error?: string }>;
  /**
   * Deletes a test drive booking by its unique ID.
   * @param id - The ID of the booking to delete.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  deleteBooking(id: string): Promise<{ success: boolean; error?: string }>;

  // Rating
  /**
   * Creates a new feedback/rating for a completed test drive booking.
   * @param data - The feedback data.
   * @returns A promise that resolves to an object containing the created rating or an error.
   */
  createRating(
    data: FeedbackDTO
  ): Promise<{ success: boolean; booking?: any; error?: string }>;
  /**
   * Deletes a feedback/rating by its unique ID.
   * @param id - The ID of the rating to delete.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  deleteRating(id: string): Promise<{ success: boolean; error?: string }>;
}

/**
 * Factory function to create an instance of the test drive service.
 * It encapsulates the business logic for managing test drive slots, bookings, and feedback,
 * including caching strategies to improve performance.
 *
 * @param testDriveRepo - The repository for test drive data access.
 * @param sellerRepo - The repository for seller data access.
 * @param evmodelRepo - The repository for EV model data access.
 * @returns An implementation of the ITestDriveService interface.
 */
export function testDriveService(
  testDriveRepo: ITestDriveRepository,
  sellerRepo: ISellerRepository,
  evmodelRepo: IEvRepository
): ITestDriveService {
  return {
    // Slot methods
    /**
     * Finds a single test drive slot by its ID, using a cache-aside pattern.
     * Caches the individual slot data for one hour.
     */
    findSlotById: async (id) => {
      try {
        const cachekey = `slot_${id}`;
        const cachedSlot = await CacheService.getOrSet<any | null>(
          cachekey,
          async () => {
            const slot = await testDriveRepo.findSlotById(id);
            return slot ?? null;
          },
          3600
        );
        if (!cachedSlot) {
          return { success: false, error: "Slot not found" };
        }
        return { success: true, slot: cachedSlot };
      } catch (err) {
        return { success: false, error: "Failed to fetch slot" };
      }
    },
    /**
     * Retrieves all test drive slots, utilizing a cache-aside pattern.
     * Caches the list of all slots for one hour.
     */
    findAllSlots: async () => {
      try {
        const cachekey = "slots";
        const cachedSlots = await CacheService.getOrSet(
          cachekey,
          async () => {
            const slots = await testDriveRepo.findAllSlots();
            return slots ?? null;
          },
          3600
        );
        if (!cachedSlots) {
          return { success: false, error: "No slots found" };
        }
        return { success: true, slots: cachedSlots };
      } catch (err) {
        return { success: false, error: "Failed to fetch slots" };
      }
    },
    /**
     * Finds all slots for a specific seller, using a cache-aside pattern.
     * Caches the list of slots for that seller for one hour.
     */
    findSlotsBySeller: async (sellerId) => {
      try {
        const cachekey = `slots_seller_${sellerId}`;
        const cacheSlots = await CacheService.getOrSet(
          cachekey,
          async () => {
            const slots = await testDriveRepo.findSlotsBySeller(sellerId);
            return slots ?? null;
          },
          3600
        );
        if (!cacheSlots) {
          return { success: false, error: "No slots found" };
        }
        return { success: true, slots: cacheSlots };
      } catch (err) {
        return { success: false, error: "Failed to fetch slots for seller" };
      }
    },
    /**
     * Finds all active slots, using a cache-aside pattern.
     * Caches the list of active slots for one hour.
     */
    findActiveSlots: async () => {
      try {
        const cachekey = "slots_active";
        const cacheSlots = await CacheService.getOrSet(
          cachekey,
          async () => {
            const slots = await testDriveRepo.findActiveSlots();
            return slots ?? null;
          },
          3600
        );
        if (!cacheSlots) {
          return { success: false, error: "No active slots found" };
        }
        return { success: true, slots: cacheSlots };
      } catch (err) {
        return { success: false, error: "Failed to fetch active slots" };
      }
    },
    /**
     * Creates a new test drive slot after validating the associated seller and EV model.
     * It invalidates all slot-related caches to ensure data consistency.
     */
    createSlot: async (data) => {
      try {
        const seller = await sellerRepo.findById(data.seller_id);
        if (!seller) return { success: false, error: "Seller not found" };
        const model = await evmodelRepo.findModelById(data.model_id);
        if (!model) return { success: false, error: "Model not found" };
        const slot = await testDriveRepo.createSlot(data);
        if (!slot) return { success: false, error: "Failed to create slot" };
        // Invalidate all slot-related caches to ensure fresh data on next read.
        await Promise.all([
          CacheService.delete("slots"),
          CacheService.deletePattern("slots_*"),
        ]);
        return { success: true, slot: slot };
      } catch (err) {
        return { success: false, error: "Failed to create slot" };
      }
    },
    /**
     * Updates an existing test drive slot's information.
     * It invalidates all slot-related caches upon a successful update.
     */
    updateSlot: async (id, data) => {
      try {
        const model = await evmodelRepo.findModelById(data.model_id!);
        if (!model) return { success: false, error: "Model not found" };
        const slot = await testDriveRepo.updateSlot(id, data);
        if (!slot) return { success: false, error: "Slot not found" };
        // Invalidate all slot-related caches.
        await Promise.all([
          CacheService.delete("slots"),
          CacheService.deletePattern("slots_*"),
          CacheService.delete(`slot_${id}`),
        ]);
        return { success: true, slote: slot };
      } catch (err) {
        return { success: false, error: "Failed to update slot" };
      }
    },
    /**
     * Deletes a test drive slot from the system.
     * It invalidates all slot-related caches upon successful deletion.
     */
    deleteSlot: async (id) => {
      try {
        const success = await testDriveRepo.deleteSlot(id);
        if (!success) return { success: false, error: "Slot not found" };
        await Promise.all([
          // Invalidate all slot-related caches.
          CacheService.delete("slots"),
          CacheService.deletePattern("slots_*"),
          CacheService.delete(`slot_${id}`),
        ]);
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete slot" };
      }
    },

    // Booking methods
    /**
     * Finds a single test drive booking by its ID, using a cache-aside pattern.
     * Caches the individual booking data for one hour.
     */
    findBookingById: async (id) => {
      try {
        const cachekey = `booking_${id}`;
        const cachedBooking = await CacheService.getOrSet<any | null>(
          cachekey,
          async () => {
            const booking = await testDriveRepo.findBookingById(id);
            return booking ?? null;
          },
          3600 // Cache for 1 hour
        );
        if (!cachedBooking) {
          return { success: false, error: "Booking not found" };
        }
        return { success: true, booking: cachedBooking };
      } catch (err) {
        return { success: false, error: "Failed to fetch booking" };
      }
    },
    /**
     * Finds all bookings for a specific customer, using a cache-aside pattern.
     * Caches the list of bookings for that customer for one hour.
     */
    findBookingsByCustomerId: async (customerId) => {
      try {
        const cachekey = `bookings_customer_${customerId}`;
        const cachedBookings = await CacheService.getOrSet<any[] | null>(
          cachekey,
          async () => {
            const bookings = await testDriveRepo.findBookingsByCustomerId(
              customerId
            );
            return bookings ?? null;
          },
          3600 // Cache for 1 hour
        );
        if (!cachedBookings) {
          return { success: false, error: "No bookings found" };
        }
        return { success: true, bookings: cachedBookings };
      } catch (err) {
        return { success: false, error: "Failed to fetch bookings" };
      }
    },
    /**
     * Creates a new test drive booking.
     * It performs validations to ensure the slot is not fully booked and the customer
     * does not already have a booking for the same slot and date.
     * Invalidates relevant booking caches upon successful creation.
     */
    createBooking: async (data) => {
      try {
        // Validate that the slot exists.
        const slot = await testDriveRepo.findSlotById(data.slot_id);
        if (!slot) return { success: false, error: "Slot not found" };

        const bookingsOnSlot = await testDriveRepo.findBookingsBySlotId(
          data.slot_id
        );
        if (!bookingsOnSlot)
          return { success: false, error: "No bookings found" };
        // Check if the slot has reached its maximum booking capacity.
        if (bookingsOnSlot.length >= slot.max_bookings) {
          return { success: false, error: "Slot is fully booked" };
        }
        // Check if the customer already has a booking for this slot on the same date.
        const customer = await testDriveRepo.findBookingsByCustomerId(
          data.customer_id
        );
        // This block has a potential logic issue where it returns inside a forEach.
        if (!customer) return { success: false, error: "No bookings found" };
        if (customer.length > 0) {
          customer.forEach((element) => {
            if (
              data.slot_id == element.slot_id.toString() &&
              data.booking_date == element.booking_date
            ) {
              return {
                success: false,
                error: "Customer already has a booking",
              };
            }
          });
        }
        // Prepare and create the new booking.
        const bookingData = {
          ...data,
          booking_date: slot.available_date,
          status: TestDriveBookingStatus.CONFIRMED,
        };
        const booking = await testDriveRepo.createBooking(bookingData as any);
        if (!booking)
          return { success: false, error: "Failed to create booking" };
        // Invalidate caches related to this customer and the new booking.
        await Promise.all([
          CacheService.delete(`bookings_customer_${data.customer_id}`),
          CacheService.delete(`booking_${booking.id}`),
        ]);

        return { success: true, booking };
      } catch (err) {
        console.log(err);
        return { success: false, error: "Failed to create booking" };
      }
    },
    /**
     * Updates an existing test drive booking.
     * It invalidates caches for the specific booking and the associated customer's booking list.
     */
    updateBooking: async (id, data) => {
      try {
        // Fetch the existing booking to get customer_id for cache invalidation.
        const existingBooking = await testDriveRepo.findBookingById(id);
        if (!existingBooking) {
          return { success: false, error: "Booking not found" };
        }

        const slot = await testDriveRepo.findSlotById(data.slot_id!);
        if (!slot) return { success: false, error: "Slot not found" };
        const { customer_id, ...filterData } = data;
        const booking = await testDriveRepo.updateBooking(id, filterData);
        if (!booking) return { success: false, error: "Booking not found" };
        // Invalidate caches to ensure data consistency.
        await Promise.all([
          CacheService.delete(`booking_${id}`),
          CacheService.delete(
            `bookings_customer_${existingBooking.customer_id}`
          ),
        ]);
        return { success: true, booking };
      } catch (err) {
        return { success: false, error: "Failed to update booking" };
      }
    },
    /**
     * Deletes a test drive booking from the system.
     * It invalidates caches for the specific booking and the customer's booking list before deletion.
     */
    deleteBooking: async (id) => {
      try {
        const booking = await testDriveRepo.findBookingById(id);
        if (booking) {
          // Invalidate caches before deleting to prevent serving stale data.
          await CacheService.delete(`booking_${id}`);
          await CacheService.delete(`bookings_customer_${booking.customer_id}`);
        }
        const success = await testDriveRepo.deleteBooking(id);
        if (!success) return { success: false, error: "Booking not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete booking" };
      }
    },

    // Ratings
    /**
     * Creates a feedback/rating for a specific test drive booking.
     */
    createRating: async (data) => {
      try {
        const booking = await testDriveRepo.findBookingById(data.booking_id);
        if (!booking) return { success: false, error: "Booking not found" };
        const bookingrate = await testDriveRepo.createRating(data);
        return { success: true, bookingrate };
      } catch (err) {
        return { success: false, error: "Failed to create rating" };
      }
    },
    /**
     * Deletes a feedback/rating from the system.
     */
    deleteRating: async (id) => {
      try {
        const success = await testDriveRepo.deleteRating(id);
        if (!success) return { success: false, error: "Rating not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete rating" };
      }
    },
  };
}
