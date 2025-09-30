import { Schema, model, Document, Types } from "mongoose";

export interface ITestDriveSlot extends Document {
  _id: Types.ObjectId;
  seller_id: Types.ObjectId;
  location: string;
  model_id: Types.ObjectId;
  available_date: Date;
  max_bookings: number;
  is_active: boolean;
}

const TestDriveSlotSchema = new Schema<ITestDriveSlot>(
  {
    seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    model_id: { type: Schema.Types.ObjectId, ref: "CarModel", required: true },
    available_date: { type: Date, required: true },
    max_bookings: { type: Number, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for efficient queries
TestDriveSlotSchema.index({ seller_id: 1 });
TestDriveSlotSchema.index({ model_id: 1 });
TestDriveSlotSchema.index({ available_date: 1 });
TestDriveSlotSchema.index({ location: 1 });
TestDriveSlotSchema.index({ is_active: 1 });

export const TestDriveSlot = model<ITestDriveSlot>("TestDriveSlot", TestDriveSlotSchema);
