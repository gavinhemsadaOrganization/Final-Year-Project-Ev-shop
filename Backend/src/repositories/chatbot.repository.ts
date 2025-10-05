import {
  ChatbotConversation,
  IChatbotConversation,
} from "../models/ChatbotConversation";
import { Prediction, IPrediction } from "../models/Prediction";
import { ChatbotConversationDTO, PredictionDTO } from "../dtos/chatbot.DTO";
import { withErrorHandling } from "../utils/CustomException";

export interface IChatbotRepository {
  findConversationById(id: string): Promise<IChatbotConversation | null>;
  findAllConversations(): Promise<IChatbotConversation[] | null>;
  findConversationsByUserId(
    user_id: string
  ): Promise<IChatbotConversation[] | null>;
  createConversation(
    data: ChatbotConversationDTO
  ): Promise<IChatbotConversation | null>;
  updateConversation(
    id: string,
    data: Partial<ChatbotConversationDTO>
  ): Promise<IChatbotConversation | null>;
  deleteConversation(id: string): Promise<boolean | null>;

  findAllPredictions(): Promise<IPrediction[] | null>;
  findPredictionById(id: string): Promise<IPrediction | null>;
  findPredictionsByConversationId(
    conversation_id: string
  ): Promise<IPrediction[] | null>;
  createPrediction(data: PredictionDTO): Promise<IPrediction | null>;
  updatePrediction(
    id: string,
    data: Partial<PredictionDTO>
  ): Promise<IPrediction | null>;
  deletePrediction(id: string): Promise<boolean | null>;
}

export const ChatbotRepository: IChatbotRepository = {
  findConversationById: withErrorHandling(async (id) =>
    ChatbotConversation.findOne({ _id: id })
  ),
  findAllConversations: withErrorHandling(async () =>
    ChatbotConversation.find()
  ),
  findConversationsByUserId: withErrorHandling(async (user_id) =>
    ChatbotConversation.find({ user_id })
  ),
  createConversation: withErrorHandling(async (data) => {
    const conversation = new ChatbotConversation(data);
    return await conversation.save();
  }),
  updateConversation: withErrorHandling(async (id, data) =>
    ChatbotConversation.findByIdAndUpdate(id, data, { new: true })
  ),
  deleteConversation: withErrorHandling(async (id) => {
    const deleted = await ChatbotConversation.findByIdAndDelete(id);
    return deleted !== null;
  }),

  findAllPredictions: withErrorHandling(async () => Prediction.find()),
  findPredictionById: withErrorHandling(async (id) =>
    Prediction.findOne({ _id: id })
  ),
  findPredictionsByConversationId: withErrorHandling(async (conversation_id) =>
    Prediction.find({ conversation_id })
  ),
  createPrediction: withErrorHandling(async (data) => {
    const prediction = new Prediction(data);
    return await prediction.save();
  }),
  updatePrediction: withErrorHandling(async (id, data) =>
    Prediction.findByIdAndUpdate(id, data, { new: true })
  ),
  deletePrediction: withErrorHandling(async (id) => {
    const deleted = await Prediction.findByIdAndDelete(id);
    return deleted !== null;
  }),
};
