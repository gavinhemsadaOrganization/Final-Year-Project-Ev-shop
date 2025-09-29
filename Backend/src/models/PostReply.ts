import { Schema, model, Document, Types } from 'mongoose';

export interface IPostReply extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  post_id: Types.ObjectId;
  content: string;
}

const PostReplySchema = new Schema<IPostReply>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const PostReply = model<IPostReply>('PostReply', PostReplySchema);
