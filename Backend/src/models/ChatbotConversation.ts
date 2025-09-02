import { Schema, model, Document, Types } from 'mongoose';

export interface IChatbotConversation extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  message_text: string;
}

const ChatbotConversationSchema = new Schema<IChatbotConversation>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message_text: { type: String, required: true },
}, { timestamps: true });

export default model<IChatbotConversation>('ChatbotConversation', ChatbotConversationSchema);
