import { Schema, model, Document, Types } from 'mongoose';
import { NotificationType } from '../enum/enum';

export interface INotification extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
}

const NotificationSchema = new Schema<INotification>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes for efficient queries
NotificationSchema.index({ user_id: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ is_read: 1 });

export const Notification = model<INotification>('Notification', NotificationSchema);
