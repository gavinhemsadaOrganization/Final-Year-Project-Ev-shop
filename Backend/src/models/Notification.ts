import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

const NotificationSchema = new Schema<INotification>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
}, { timestamps: true });

export default model<INotification>('Notification', NotificationSchema);
