import { Request, Response } from "express";
import { IChatbotService } from "./chatbot.service";
import { handleResult, handleError } from "../../shared/utils/Respons.util";

/**
 * Defines the contract for the chatbot controller, specifying methods for handling HTTP requests
 * related to chatbot conversations and predictions.
 */
export interface IChatbotController {
  // Conversation methods
  /**
   * Handles the HTTP request to get a conversation by its unique ID.
   * @param req - The Express request object, containing the conversation ID in `req.params`.
   * @param res - The Express response object.
   */
  getConversationByID(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to get all conversations for a specific user.
   * @param req - The Express request object, containing the user ID in `req.params`.
   * @param res - The Express response object.
   */
  getConversationsByUserID(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to retrieve all conversations.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  getAllConversations(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to get a response from the chatbot for a given question.
   * @param req - The Express request object, containing the question in the body.
   * @param res - The Express response object.
   */
  getRespons(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to create a new conversation.
   * @param req - The Express request object, containing conversation data in the body.
   * @param res - The Express response object.
   */
  createConversation(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to update an existing conversation.
   * @param req - The Express request object, containing the conversation ID and update data.
   * @param res - The Express response object.
   */
  updateConversation(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to delete a conversation.
   * @param req - The Express request object, containing the conversation ID in `req.params`.
   * @param res - The Express response object.
   */
  deleteConversation(req: Request, res: Response): Promise<Response>;

  // Prediction methods
  /**
   * Handles the HTTP request to get a prediction by its unique ID.
   * @param req - The Express request object, containing the prediction ID in `req.params`.
   * @param res - The Express response object.
   */
  getPredictionByID(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to get all predictions for a specific conversation.
   * @param req - The Express request object, containing the conversation ID in `req.params`.
   * @param res - The Express response object.
   */
  getPredictionsByConversationID(
    req: Request,
    res: Response
  ): Promise<Response>;
  /**
   * Handles the HTTP request to retrieve all predictions.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  getAllPredictions(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to create a new prediction record.
   * @param req - The Express request object, containing prediction data in the body.
   * @param res - The Express response object.
   */
  createPrediction(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to update an existing prediction record.
   * @param req - The Express request object, containing the prediction ID and update data.
   * @param res - The Express response object.
   */
  updatePrediction(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to delete a prediction record.
   * @param req - The Express request object, containing the prediction ID in `req.params`.
   * @param res - The Express response object.
   */
  deletePrediction(req: Request, res: Response): Promise<Response>;
}

/**
 * Factory function to create an instance of the chatbot controller.
 * It encapsulates the logic for handling API requests related to the chatbot.
 *
 * @param chatbotService - The chatbot service dependency that contains the business logic.
 * @returns An implementation of the IChatbotController interface.
 */
export function chatbotController(
  chatbotService: IChatbotService
): IChatbotController {
  return {
    // Conversations
    /**
     * Retrieves a single conversation by its ID.
     */
    getConversationByID: async (req, res) => {
      try {
        const result = await chatbotService.findConversationById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getConversationByID");
      }
    },
    /**
     * Retrieves all conversations for a specific user.
     */
    getConversationsByUserID: async (req, res) => {
      try {
        const result = await chatbotService.findConversationsByUserId(
          req.params.user_id
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getConversationsByUserID");
      }
    },
    /**
     * Retrieves a list of all conversations.
     */
    getAllConversations: async (req, res) => {
      try {
        const result = await chatbotService.findAllConversations();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllConversations");
      }
    },
    /**
     * Gets a direct response from the chatbot service for a given question.
     */
    getRespons: async (req, res) => {
      try {
        const result = await chatbotService.getRespons(req.body.question);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getRespons");
      }
    },
    /**
     * Creates a new conversation.
     */
    createConversation: async (req, res) => {
      try {
        const result = await chatbotService.createConversation(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createConversation");
      }
    },
    /**
     * Updates an existing conversation.
     */
    updateConversation: async (req, res) => {
      try {
        const result = await chatbotService.updateConversation(
          req.params.id,
          req.body
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateConversation");
      }
    },
    /**
     * Deletes a conversation by its ID.
     */
    deleteConversation: async (req, res) => {
      try {
        const result = await chatbotService.deleteConversation(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteConversation");
      }
    },
    // Predictions
    /**
     * Retrieves a single prediction by its ID.
     */
    getPredictionByID: async (req, res) => {
      try {
        const result = await chatbotService.findPredictionById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getPredictionByID");
      }
    },
    /**
     * Retrieves all predictions for a specific conversation.
     */
    getPredictionsByConversationID: async (req, res) => {
      try {
        const result = await chatbotService.findPredictionsByConversationId(
          req.params.conversation_id
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getPredictionsByConversationID");
      }
    },
    /**
     * Retrieves a list of all predictions.
     */
    getAllPredictions: async (req, res) => {
      try {
        const result = await chatbotService.findAllPredictions();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllPredictions");
      }
    },
    /**
     * Creates a new prediction record.
     */
    createPrediction: async (req, res) => {
      try {
        const result = await chatbotService.createPrediction(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createPrediction");
      }
    },
    /**
     * Updates an existing prediction record.
     */
    updatePrediction: async (req, res) => {
      try {
        const result = await chatbotService.updatePrediction(
          req.params.id,
          req.body
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updatePrediction");
      }
    },
    /**
     * Deletes a prediction record by its ID.
     */
    deletePrediction: async (req, res) => {
      try {
        const result = await chatbotService.deletePrediction(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deletePrediction");
      }
    },
  };
}
