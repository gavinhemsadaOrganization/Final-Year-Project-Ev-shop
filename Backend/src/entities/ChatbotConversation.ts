import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a single message entry in a chatbot conversation.
 * Each document logs a message sent by a user.
 */
export interface IChatbotConversation extends Document {
  /** The unique identifier for the conversation entry document. */
  _id: Types.ObjectId;
  /** The ID of the user who sent the message. */
  user_id: Types.ObjectId;
  /** The text content of the user's message. */
  message_text: string;
}

/**
 * Mongoose schema for the ChatbotConversation collection.
 */
const ChatbotConversationSchema = new Schema<IChatbotConversation>(
  {
    /**
     * A reference to the User who initiated this part of the conversation.
     */
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    /**
     * The raw text of the user's message to the chatbot.
     */
    message_text: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * Creates an index on the `user_id` field to allow for efficient retrieval
 * of all conversation entries for a specific user.
 */
ChatbotConversationSchema.index({ user_id: 1 });

/**
 * The Mongoose model for the ChatbotConversation collection.
 */
export const ChatbotConversation = model<IChatbotConversation>(
  "ChatbotConversation",
  ChatbotConversationSchema
);
