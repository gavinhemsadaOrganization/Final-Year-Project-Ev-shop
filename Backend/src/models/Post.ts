import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  _id: Types.ObjectId;
  category_id: Types.ObjectId;
  user_id: Types.ObjectId;
  title: string;
  content: string;
  views: number;
  reply_count: number;
  last_reply_by?: Types.ObjectId;
}

const PostSchema = new Schema<IPost>({
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  views: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  last_reply_by: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default model<IPost>('Post', PostSchema);
