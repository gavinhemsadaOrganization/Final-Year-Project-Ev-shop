import { validateDto } from "../middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IChatbotController } from "../controllers/chatbot.controller";
import { ChatbotConversationDTO, PredictionDTO } from "../dtos/chatbot.DTO";
import { container } from "../di/chatbot.di";

/**
 * Factory function that creates and configures the router for chatbot-related endpoints.
 * It resolves the chatbot controller from the dependency injection container and maps
 * controller methods to specific API routes for conversations and predictions.
 *
 * @returns The configured Express Router for the chatbot.
 */
export const chatbotRouter = (): Router => {
  const router = Router();
  // Resolve the chatbot controller from the DI container.
  const chatbotController =
    container.resolve<IChatbotController>("ChatbotController");

  // --- Conversation Routes ---

  /**
   * @route GET /api/chatbot/conversations/:id
   * @description Retrieves a single conversation entry by its unique ID.
   * @access Private (User who owns the conversation, or Admin)
   */
  router.get("/conversations/:id", (req, res) =>
    chatbotController.getConversationByID(req, res)
  );

  /**
   * @route GET /api/chatbot/conversations/user/:user_id
   * @description Retrieves all conversation entries for a specific user.
   * @access Private (User can get their own conversations, or Admin)
   */
  router.get("/conversations/user/:user_id", (req, res) =>
    chatbotController.getConversationsByUserID(req, res)
  );

  /**
   * @route GET /api/chatbot/conversations
   * @description Retrieves a list of all conversations.
   * @access Private (Typically restricted to Admins)
   */
  router.get("/conversations", (req, res) =>
    chatbotController.getAllConversations(req, res)
  );

  /**
   * @route POST /api/chatbot/ask
   * @description Sends a question to the chatbot and gets a direct response.
   * @access Public or Private (Authenticated User)
   */
  router.post("/ask", (req, res) => chatbotController.getRespons(req, res));

  /**
   * @route POST /api/chatbot/conversations
   * @description Creates a new conversation entry (logs a user's message).
   * @middleware validateDto(ChatbotConversationDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post(
    "/conversations",
    validateDto(ChatbotConversationDTO),
    (req, res) => chatbotController.createConversation(req, res)
  );

  /**
   * @route PUT /api/chatbot/conversations/:id
   * @description Updates an existing conversation entry.
   * @middleware validateDto(ChatbotConversationDTO) - Validates the request body.
   * @access Private (User who owns the conversation, or Admin)
   */
  router.put(
    "/conversations/:id",
    validateDto(ChatbotConversationDTO),
    (req, res) => chatbotController.updateConversation(req, res)
  );

  /**
   * @route DELETE /api/chatbot/conversations/:id
   * @description Deletes a conversation entry by its unique ID.
   * @access Private (User who owns the conversation, or Admin)
   */
  router.delete("/conversations/:id", (req, res) =>
    chatbotController.deleteConversation(req, res)
  );

  // --- Prediction Routes ---

  /**
   * @route GET /api/chatbot/predictions/:id
   * @description Retrieves a single prediction record by its unique ID.
   * @access Private (Typically restricted to Admins)
   */
  router.get("/predictions/:id", (req, res) =>
    chatbotController.getPredictionByID(req, res)
  );

  /**
   * @route GET /api/chatbot/predictions/conversation/:conversation_id
   * @description Retrieves all prediction records for a specific conversation.
   * @access Private (Typically restricted to Admins)
   */
  router.get("/predictions/conversation/:conversation_id", (req, res) =>
    chatbotController.getPredictionsByConversationID(req, res)
  );

  /**
   * @route GET /api/chatbot/predictions
   * @description Retrieves a list of all prediction records.
   * @access Private (Typically restricted to Admins)
   */
  router.get("/predictions", (req, res) =>
    chatbotController.getAllPredictions(req, res)
  );

  /**
   * @route POST /api/chatbot/predictions
   * @description Creates a new prediction record.
   * @middleware validateDto(PredictionDTO) - Validates the request body.
   * @access Private (Typically called internally by the chatbot service)
   */
  router.post("/predictions", validateDto(PredictionDTO), (req, res) =>
    chatbotController.createPrediction(req, res)
  );

  /**
   * @route PUT /api/chatbot/predictions/:id
   * @description Updates an existing prediction record.
   * @middleware validateDto(PredictionDTO) - Validates the request body.
   * @access Private (Typically restricted to Admins)
   */
  router.put("/predictions/:id", validateDto(PredictionDTO), (req, res) =>
    chatbotController.updatePrediction(req, res)
  );

  /**
   * @route DELETE /api/chatbot/predictions/:id
   * @description Deletes a prediction record by its unique ID.
   * @access Private (Typically restricted to Admins)
   */
  router.delete("/predictions/:id", (req, res) =>
    chatbotController.deletePrediction(req, res)
  );
  return router;
};
