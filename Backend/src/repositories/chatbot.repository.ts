import {
  ChatbotConversation,
  IChatbotConversation,
} from "../models/ChatbotConversation";
import { Prediction, IPrediction } from "../models/Prediction";
import { ChatbotConversationDTO, PredictionDTO } from "../dtos/chatbot.DTO";

export interface IChatbotRepository {
    findConversationById(id: string): Promise<IChatbotConversation | null>;
    findAllConversations(): Promise<IChatbotConversation[] | null>;
    findConversationsByUserId(user_id: string): Promise<IChatbotConversation[] | null>;
    createConversation(data: ChatbotConversationDTO): Promise<IChatbotConversation>;
    updateConversation(id: string, data: Partial<ChatbotConversationDTO>): Promise<IChatbotConversation | null>;
    deleteConversation(id: string): Promise<boolean>;
    
    findAllPredictions(): Promise<IPrediction[] | null>;
    findPredictionById(id: string): Promise<IPrediction | null>;
    findPredictionsByConversationId(conversation_id: string): Promise<IPrediction[] | null>;
    createPrediction(data: PredictionDTO): Promise<IPrediction>;
    updatePrediction(id: string, data: Partial<PredictionDTO>): Promise<IPrediction | null>;
    deletePrediction(id: string): Promise<boolean>;
}

export const ChatbotRepository : IChatbotRepository = {
   
    findConversationById: async (id) => {   
        return await ChatbotConversation.findOne({ _id: id });
    },
    findAllConversations: async () => {   
        return await ChatbotConversation.find();
    },
    findConversationsByUserId: async (user_id) => {   
        return await ChatbotConversation.find({ user_id });
    },
    createConversation: async (data) => {   
        const conversation = new ChatbotConversation(data);
        return await conversation.save();
    },
    updateConversation: async (id, data) => {   
        return await ChatbotConversation.findByIdAndUpdate(id, data, { new: true });
    },
    deleteConversation: async (id) => {   
        const deleted = await ChatbotConversation.findByIdAndDelete(id);
        return deleted !== null;
    },

    findAllPredictions: async () => {   
        return await Prediction.find();
    },
    findPredictionById: async (id) => {   
        return await Prediction.findOne({ _id: id });
    },
    findPredictionsByConversationId: async (conversation_id) => {   
        return await Prediction.find({ conversation_id });
    },
    createPrediction: async (data) => {   
        const prediction = new Prediction(data);
        return await prediction.save();
    },
    updatePrediction: async (id, data) => {   
        return await Prediction.findByIdAndUpdate(id, data, { new: true });
    },
    deletePrediction: async (id) => {   
        const deleted = await Prediction.findByIdAndDelete(id);
        return deleted !== null;
    }
}
