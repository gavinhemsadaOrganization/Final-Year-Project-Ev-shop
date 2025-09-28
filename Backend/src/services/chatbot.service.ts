import { IChatbotRepository } from "../repositories/chatbot.repository";
import { ChatbotConversationDTO, PredictionDTO } from "../dtos/chatbot.DTO";

export interface IChatbotService {
  findConversationById(
    id: string
  ): Promise<{ success: boolean; conversation?: any; error?: string }>;
  findAllConversations(): Promise<{
    success: boolean;
    conversations?: any[];
    error?: string;
  }>;
  findConversationsByUserId(
    user_id: string
  ): Promise<{ success: boolean; conversations?: any[]; error?: string }>;
  createConversation(
    data: ChatbotConversationDTO
  ): Promise<{ success: boolean; conversation?: any; error?: string }>;
  updateConversation(
    id: string,
    data: Partial<ChatbotConversationDTO>
  ): Promise<{ success: boolean; conversation?: any; error?: string }>;
  deleteConversation(id: string): Promise<{ success: boolean; error?: string }>;

  findAllPredictions(): Promise<{
    success: boolean;
    predictions?: any[];
    error?: string;
  }>;
  findPredictionById(
    id: string
  ): Promise<{ success: boolean; prediction?: any; error?: string }>;
  findPredictionsByConversationId(
    conversation_id: string
  ): Promise<{ success: boolean; predictions?: any[]; error?: string }>;
  createPrediction(
    data: PredictionDTO
  ): Promise<{ success: boolean; prediction?: any; error?: string }>;
  updatePrediction(
    id: string,
    data: Partial<PredictionDTO>
  ): Promise<{ success: boolean; prediction?: any; error?: string }>;
  deletePrediction(id: string): Promise<{ success: boolean; error?: string }>;
}

export function chatbotService(
  chatbotRepo: IChatbotRepository
): IChatbotService {
  return {
    findConversationById: async (id) => {
      try {
        const conversation = await chatbotRepo.findConversationById(id);
        if (!conversation)
          return { success: false, error: "Conversation not found" };
        return { success: true, conversation };
      } catch (err) {
        return { success: false, error: "Failed to fetch conversation" };
      }
    },
    findAllConversations: async () => {
      try {
        const conversations = await chatbotRepo.findAllConversations();
        if (!conversations)
          return { success: false, error: "No conversations found" };
        return { success: true, conversations };
      } catch (err) {
        return { success: false, error: "Failed to fetch conversations" };
      }
    },
    findConversationsByUserId: async (user_id) => {
      try {
        const conversations = await chatbotRepo.findConversationsByUserId(
          user_id
        );
        if (!conversations)
          return {
            success: false,
            error: "No conversations found for this user",
          };
        return { success: true, conversations };
      } catch (err) {
        return { success: false, error: "Failed to fetch conversations" };
      }
    },
    createConversation: async (data) => {
      try {
        const conversation = await chatbotRepo.createConversation(data);
        return { success: true, conversation };
      } catch (err) {
        return { success: false, error: "Failed to create conversation" };
      }
    },
    updateConversation: async (id, data) => {
      try {
        const conversation = await chatbotRepo.updateConversation(id, data);
        if (!conversation)
          return { success: false, error: "Conversation not found" };
        return { success: true, conversation };
      } catch (err) {
        return { success: false, error: "Failed to update conversation" };
      }
    },
    deleteConversation: async (id) => {
      try {
        const success = await chatbotRepo.deleteConversation(id);
        if (!success)
          return { success: false, error: "Conversation not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete conversation" };
      }
    },

    findAllPredictions: async () => {
      try {
        const predictions = await chatbotRepo.findAllPredictions();
        if (!predictions)
          return { success: false, error: "No predictions found" };
        return { success: true, predictions };
      } catch (err) {  
        return { success: false, error: "Failed to fetch predictions" };
      }
    },
    findPredictionById: async (id) => {
      try {
        const prediction = await chatbotRepo.findPredictionById(id);
        if (!prediction)
          return { success: false, error: "Prediction not found" };
        return { success: true, prediction };
      } catch (err) {
        return { success: false, error: "Failed to fetch prediction" };
      }
    },
    findPredictionsByConversationId: async (conversation_id) => {
      try {
        const predictions = await chatbotRepo.findPredictionsByConversationId(
          conversation_id
        );
        if (!predictions)
          return {
            success: false,
            error: "No predictions found for this conversation",
          };
        return { success: true, predictions };
      } catch (err) {
        return { success: false, error: "Failed to fetch predictions" };
      }
    },
    createPrediction: async (data) => {
      try {
        const prediction = await chatbotRepo.createPrediction(data);
        return { success: true, prediction };
      } catch (err) {
        return { success: false, error: "Failed to create prediction" };
      }
    },
    updatePrediction: async (id, data) => {
      try {
        const prediction = await chatbotRepo.updatePrediction(id, data);
        if (!prediction)
          return { success: false, error: "Prediction not found" };
        return { success: true, prediction };
      } catch (err) {
        return { success: false, error: "Failed to update prediction" };
      }
    },
    deletePrediction: async (id) => {
      try {
        const success = await chatbotRepo.deletePrediction(id);
        if (!success) return { success: false, error: "Prediction not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete prediction" };
      }
    },
  };
}
