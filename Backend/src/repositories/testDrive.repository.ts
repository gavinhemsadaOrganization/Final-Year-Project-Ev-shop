import { Types } from "mongoose";
import { TestDriveSlot, ITestDriveSlot } from "../models/TestDriveSlot";
import { TestDriveBooking, ITestDriveBooking } from "../models/TestDrivingBooking";
import { TestDriveBookingDTO, TestDriveSlotDTO, FeedbackDTO } from "../dtos/testDrive.DTO";

export interface ITestDriveRepository {
  // Slot methods
  createSlot(data: TestDriveSlotDTO): Promise<ITestDriveSlot>;
  findSlotById(id: string): Promise<ITestDriveSlot | null>;
  findAllSlots(): Promise<ITestDriveSlot[]>;
  findSlotsBySeller(sellerId: string): Promise<ITestDriveSlot[]>;
  findActiveSlots(): Promise<ITestDriveSlot[]>;
  updateSlot(
    id: string,
    data: Partial<TestDriveSlotDTO>
  ): Promise<ITestDriveSlot | null>;
  deleteSlot(id: string): Promise<boolean>;

  // Booking methods
  createBooking(data: TestDriveBookingDTO): Promise<ITestDriveBooking>;
  findBookingById(id: string): Promise<ITestDriveBooking | null>;
  findBookingsByCustomerId(customerId: string): Promise<ITestDriveBooking[]>;
  findBookingsBySlotId(slotId: string): Promise<ITestDriveBooking[]>;
  updateBooking(
    id: string,
    data: Partial<TestDriveBookingDTO>
  ): Promise<ITestDriveBooking | null>;
  deleteBooking(id: string): Promise<boolean>;
  
  // rating
  createRating(data: FeedbackDTO) : Promise<ITestDriveBooking>;
  deleteRating(id: string): Promise<boolean>;
}

export const TestDriveRepository: ITestDriveRepository = {
  // Slot methods
  createSlot: async (data) => {
    const slot = new TestDriveSlot(data);
    console.log(slot);
    return await slot.save();
  },

  findSlotById: async (id) => {
    return await TestDriveSlot.findById(id);
  },

  findAllSlots: async () => {
    return await TestDriveSlot.find({ is_active: true }).sort({
      available_date: 1,
    });
  },

  findSlotsBySeller: async (sellerId) => {
    return await TestDriveSlot.find({
      seller_id: new Types.ObjectId(sellerId),
    }).sort({ available_date: -1 });
  },
  findActiveSlots: async () =>{
    return await TestDriveSlot.find({ is_active: true }).sort({
      available_date: 1,
    });
  },
  updateSlot: async (id, data) => {
    return await TestDriveSlot.findByIdAndUpdate(id, data, { new: true });
  },

  deleteSlot: async (id) => {
    const result = await TestDriveSlot.findByIdAndDelete(id);
    return result !== null;
  },

  // Booking methods
  createBooking: async (data) => {
    const booking = new TestDriveBooking(data);
    return await booking.save();
  },

  findBookingById: async (id) => {
    return await TestDriveBooking.findById(id)
      .populate("slot_id");
  },

  findBookingsByCustomerId: async (customerId) => {
    return await TestDriveBooking.find({
      customer_id: new Types.ObjectId(customerId),
    })
      .populate("slot_id")
      .sort({ booking_date: -1 });
  },

  findBookingsBySlotId: async (slotId) => {
    return await TestDriveBooking.find({ slot_id: new Types.ObjectId(slotId) });
  },

  updateBooking: async (id, data) => {
    return await TestDriveBooking.findByIdAndUpdate(id, data, { new: true });
  },

  deleteBooking: async (id) => {
    const result = await TestDriveBooking.findByIdAndDelete(id);
    return result !== null;
  },

  // Ratings
  createRating: async (data) => {
    const booking = await TestDriveBooking.findById(data.booking_id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    booking.feedback_rating = data.rating;
    booking.feedback_comment = data.comment;
    return await booking.save();
  },

  deleteRating: async (id) => {
    const booking = await TestDriveBooking.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    booking.feedback_rating = undefined;
    booking.feedback_comment = undefined;
    const  result = await booking.save();
    return result !== null;
  },
};

export default TestDriveRepository;
