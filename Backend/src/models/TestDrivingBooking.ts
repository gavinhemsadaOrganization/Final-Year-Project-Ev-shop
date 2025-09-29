import { Schema, model, Document, Types } from "mongoose";

export interface ITestDriveBooking extends Document {
  _id: Types.ObjectId;
  customer_id: Types.ObjectId;
  slot_id: Types.ObjectId;
  booking_date: Date;
  booking_time: string;
  status: string;
  feedback_rating?: number;
  feedback_comment?: string;
  duration_minutes: number;
}

const TestDriveBookingSchema = new Schema<ITestDriveBooking>(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slot_id: {
      type: Schema.Types.ObjectId,
      ref: "TestDriveSlot",
      required: true,
    },
    booking_date: { type: Date, required: true },
    booking_time: { type: String, required: true },
    status: { type: String, required: true },
    feedback_rating: { type: Number, min: 1, max: 5 },
    feedback_comment: { type: String },
    duration_minutes: { type: Number, required: true },
  },
  { timestamps: true }
);

// Indexes for efficient queries
TestDriveBookingSchema.index({ customer_id: 1 });
TestDriveBookingSchema.index({ slot_id: 1 });
TestDriveBookingSchema.index({ booking_date: 1 });
TestDriveBookingSchema.index({ status: 1 });

export default model<ITestDriveBooking>(
  "TestDriveBooking",
  TestDriveBookingSchema
);
