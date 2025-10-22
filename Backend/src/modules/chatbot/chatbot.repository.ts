import {
  ChatbotConversation,
  IChatbotConversation,
} from "../../entities/ChatbotConversation";
import { Prediction, IPrediction } from "../../entities/Prediction";
import { ChatbotConversationDTO, PredictionDTO } from "../../dtos/chatbot.DTO";
import { withErrorHandling } from "../../shared/utils/CustomException";

/**
 * Defines the contract for the chatbot repository, specifying the methods for data access operations
 * related to chatbot conversations and predictions.
 */
export interface IChatbotRepository {
  // Conversation Methods
  /**
   * Finds a single conversation entry by its unique ID.
   * @param id - The ID of the conversation entry to find.
   * @returns A promise that resolves to the conversation document or null if not found.
   */
  findConversationById(id: string): Promise<IChatbotConversation | null>;
  /**
   * Retrieves all conversation entries from the database.
   * @returns A promise that resolves to an array of conversation documents or null.
   */
  findAllConversations(): Promise<IChatbotConversation[] | null>;
  /**
   * Finds all conversation entries for a specific user.
   * @param user_id - The ID of the user.
   * @returns A promise that resolves to an array of conversation documents or null.
   */
  findConversationsByUserId(
    user_id: string
  ): Promise<IChatbotConversation[] | null>;
  /**
   * Creates a new conversation entry.
   * @param data - The DTO containing the details for the new conversation entry.
   * @returns A promise that resolves to the created conversation document or null.
   */
  createConversation(
    data: ChatbotConversationDTO
  ): Promise<IChatbotConversation | null>;
  /**
   * Updates an existing conversation entry.
   * @param id - The ID of the conversation entry to update.
   * @param data - The partial DTO containing the fields to update.
   * @returns A promise that resolves to the updated conversation document or null.
   */
  updateConversation(
    id: string,
    data: Partial<ChatbotConversationDTO>
  ): Promise<IChatbotConversation | null>;
  /**
   * Deletes a conversation entry by its unique ID.
   * @param id - The ID of the conversation entry to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  deleteConversation(id: string): Promise<boolean | null>;

  // Prediction Methods
  /**
   * Retrieves all prediction records from the database.
   * @returns A promise that resolves to an array of prediction documents or null.
   */
  findAllPredictions(): Promise<IPrediction[] | null>;
  /**
   * Finds a single prediction record by its unique ID.
   * @param id - The ID of the prediction to find.
   * @returns A promise that resolves to the prediction document or null if not found.
   */
  findPredictionById(id: string): Promise<IPrediction | null>;
  /**
   * Finds all prediction records for a specific conversation.
   * @param conversation_id - The ID of the parent conversation.
   * @returns A promise that resolves to an array of prediction documents or null.
   */
  findPredictionsByConversationId(
    conversation_id: string
  ): Promise<IPrediction[] | null>;
  /**
   * Creates a new prediction record.
   * @param data - The DTO containing the details for the new prediction.
   * @returns A promise that resolves to the created prediction document or null.
   */
  createPrediction(data: PredictionDTO): Promise<IPrediction | null>;
  /**
   * Updates an existing prediction record.
   * @param id - The ID of the prediction to update.
   * @param data - The partial DTO containing the fields to update.
   * @returns A promise that resolves to the updated prediction document or null.
   */
  updatePrediction(
    id: string,
    data: Partial<PredictionDTO>
  ): Promise<IPrediction | null>;
  /**
   * Deletes a prediction record by its unique ID.
   * @param id - The ID of the prediction to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  deletePrediction(id: string): Promise<boolean | null>;
}

/**
 * The concrete implementation of the IChatbotRepository interface.
 * Each method is wrapped with a higher-order function `withErrorHandling` to ensure
 * consistent error management across the repository.
 */
export const ChatbotRepository: IChatbotRepository = {
  /** Finds a single conversation entry by its document ID. */
  findConversationById: withErrorHandling(async (id) =>
    ChatbotConversation.findById(id)
  ),
  /** Retrieves all conversation entries, sorted by most recent, and populates user details. */
  findAllConversations: withErrorHandling(async () =>
    ChatbotConversation.find()
      .sort({ createdAt: -1 })
      .populate("user_id", "name profile_image")
  ),
  /** Finds all conversation entries for a specific user, sorted by most recent. */
  findConversationsByUserId: withErrorHandling(async (user_id) =>
    ChatbotConversation.find({ user_id }).sort({ createdAt: -1 })
  ),
  /** Creates a new ChatbotConversation document. */
  createConversation: withErrorHandling(async (data) => {
    const conversation = new ChatbotConversation(data);
    return await conversation.save();
  }),
  /** Finds a conversation entry by ID and updates it with new data. */
  updateConversation: withErrorHandling(async (id, data) =>
    ChatbotConversation.findByIdAndUpdate(id, data, { new: true })
  ),
  /** Deletes a conversation entry by its document ID. */
  deleteConversation: withErrorHandling(async (id) => {
    const deleted = await ChatbotConversation.findByIdAndDelete(id);
    return deleted !== null;
  }),

  /** Retrieves all prediction records, sorted by most recent. */
  findAllPredictions: withErrorHandling(async () => Prediction.find()),
  /** Finds a single prediction record by its document ID. */
  findPredictionById: withErrorHandling(async (id) => Prediction.findById(id)),
  /** Finds all prediction records for a specific conversation, sorted by most recent. */
  findPredictionsByConversationId: withErrorHandling(async (conversation_id) =>
    Prediction.find({ conversation_id }).sort({ createdAt: -1 })
  ),
  /** Creates a new Prediction document. */
  createPrediction: withErrorHandling(async (data) => {
    const prediction = new Prediction(data);
    return await prediction.save();
  }),
  /** Finds a prediction record by ID and updates it with new data. */
  updatePrediction: withErrorHandling(async (id, data) =>
    Prediction.findByIdAndUpdate(id, data, { new: true })
  ),
  /** Deletes a prediction record by its document ID. */
  deletePrediction: withErrorHandling(async (id) => {
    const deleted = await Prediction.findByIdAndDelete(id);
    return deleted !== null;
  }),
};
