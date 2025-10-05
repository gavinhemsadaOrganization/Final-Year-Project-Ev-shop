import { Types } from "mongoose";
import { TestDriveSlot, ITestDriveSlot } from "../models/TestDriveSlot";
import { TestDriveBooking, ITestDriveBooking } from "../models/TestDrivingBooking";
import { TestDriveBookingDTO, TestDriveSlotDTO, FeedbackDTO } from "../dtos/testDrive.DTO";
import { withErrorHandling } from "../utils/CustomException";

export interface ITestDriveRepository {
  // Slot methods
  createSlot(data: TestDriveSlotDTO): Promise<ITestDriveSlot | null>;
  findSlotById(id: string): Promise<ITestDriveSlot | null>;
  findAllSlots(): Promise<ITestDriveSlot[]| null>;
  findSlotsBySeller(sellerId: string): Promise<ITestDriveSlot[] | null>;
  findActiveSlots(): Promise<ITestDriveSlot[] | null>;
  updateSlot(
    id: string,
    data: Partial<TestDriveSlotDTO>
  ): Promise<ITestDriveSlot | null>;
  deleteSlot(id: string): Promise<boolean | null>;

  // Booking methods
  createBooking(data: TestDriveBookingDTO): Promise<ITestDriveBooking | null>;
  findBookingById(id: string): Promise<ITestDriveBooking | null>;
  findBookingsByCustomerId(customerId: string): Promise<ITestDriveBooking[] | null>;
  findBookingsBySlotId(slotId: string): Promise<ITestDriveBooking[] | null>;
  updateBooking(
    id: string,
    data: Partial<TestDriveBookingDTO>
  ): Promise<ITestDriveBooking | null>;
  deleteBooking(id: string): Promise<boolean | null>;
  
  // rating
  createRating(data: FeedbackDTO) : Promise<ITestDriveBooking | null>;
  deleteRating(id: string): Promise<boolean | null>;
}

export const TestDriveRepository: ITestDriveRepository = {
  // Slot methods
  createSlot: withErrorHandling(async (data) => {
    const slot = new TestDriveSlot(data);
    console.log(slot);
    return await slot.save();
  }),

  findSlotById: withErrorHandling(async (id) => {
    return await TestDriveSlot.findById(id);
  }),

  findAllSlots: withErrorHandling(async () => {
    return await TestDriveSlot.find({ is_active: true }).sort({
      available_date: 1,
    });
  }),

  findSlotsBySeller: withErrorHandling(async (sellerId) => {
    return await TestDriveSlot.find({
      seller_id: new Types.ObjectId(sellerId),
    }).sort({ available_date: -1 });
  }),
  findActiveSlots: withErrorHandling(async () =>{
    return await TestDriveSlot.find({ is_active: true }).sort({
      available_date: 1,
    });
  }),
  updateSlot: withErrorHandling(async (id, data) => {
    return await TestDriveSlot.findByIdAndUpdate(id, data, { new: true });
  }),

  deleteSlot: withErrorHandling(async (id) => {
    const result = await TestDriveSlot.findByIdAndDelete(id);
    return result !== null;
  }),

  // Booking methods
  createBooking: withErrorHandling(async (data) => {
    const booking = new TestDriveBooking(data);
    return await booking.save();
  }),

  findBookingById: withErrorHandling(async (id) => {
    return await TestDriveBooking.findById(id)
      .populate("slot_id");
  }),

  findBookingsByCustomerId: withErrorHandling(async (customerId) => {
    return await TestDriveBooking.find({
      customer_id: new Types.ObjectId(customerId),
    })
      .populate("slot_id")
      .sort({ booking_date: -1 });
  }),

  findBookingsBySlotId: withErrorHandling(async (slotId) => {
    return await TestDriveBooking.find({ slot_id: new Types.ObjectId(slotId) });
  }),

  updateBooking: withErrorHandling(async (id, data) => {
    return await TestDriveBooking.findByIdAndUpdate(id, data, { new: true });
  }),

  deleteBooking: withErrorHandling(async (id) => {
    const result = await TestDriveBooking.findByIdAndDelete(id);
    return result !== null;
  }),

  // Ratings
  createRating: withErrorHandling(async (data) => {
    const booking = await TestDriveBooking.findById(data.booking_id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    booking.feedback_rating = data.rating;
    booking.feedback_comment = data.comment;
    return await booking.save();
  }),

  deleteRating: withErrorHandling(async (id) => {
    const booking = await TestDriveBooking.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    booking.feedback_rating = undefined;
    booking.feedback_comment = undefined;
    const  result = await booking.save();
    return result !== null;
  }),
};

export default TestDriveRepository;
