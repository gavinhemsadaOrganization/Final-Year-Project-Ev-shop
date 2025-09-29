import { Request, Response } from "express";
import { IChatbotService } from "../services/chatbot.service";
import logger from "../utils/logger";

export interface IChatbotController {
  getConversationByID(req: Request, res: Response): Promise<Response>;
  getConversationsByUserID(req: Request, res: Response): Promise<Response>;
  getAllConversations(req: Request, res: Response): Promise<Response>;
  createConversation(req: Request, res: Response): Promise<Response>;
  updateConversation(req: Request, res: Response): Promise<Response>;
  deleteConversation(req: Request, res: Response): Promise<Response>;

  getPredictionByID(req: Request, res: Response): Promise<Response>;
  getPredictionsByConversationID(
    req: Request,
    res: Response
  ): Promise<Response>;
  getAllPredictions(req: Request, res: Response): Promise<Response>;
  createPrediction(req: Request, res: Response): Promise<Response>;
  updatePrediction(req: Request, res: Response): Promise<Response>;
  deletePrediction(req: Request, res: Response): Promise<Response>;
}

export function chatbotController(
  chatbotService: IChatbotService
): IChatbotController {
  return {
    // Conversations
    getConversationByID: async (req, res) => {
      try {
        const result = await chatbotService.findConversationById(req.params.id);
        if (!result.success) {
          logger.warn(
            `Failed to get conversation by ID: ${req.params.id} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(
          `Successfully retrieved conversation by ID: ${req.params.id}`
        );
        return res
          .status(200)
          .json({ message: "Conversation", result: result.conversation });
      } catch (err) {
        logger.error(`Error getting conversation by ID: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    getConversationsByUserID: async (req, res) => {
      try {
        const result = await chatbotService.findConversationsByUserId(
          req.params.user_id
        );
        if (!result.success) {
          logger.warn(
            `Failed to get conversations by User ID: ${req.params.user_id} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(
          `Successfully retrieved conversations by User ID: ${req.params.user_id}`
        );
        return res
          .status(200)
          .json({ message: "Conversations", result: result.conversations });
      } catch (err) {
        logger.error(`Error getting conversations by User ID: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    getAllConversations: async (req, res) => {
      try {
        const result = await chatbotService.findAllConversations();
        if (!result.success) {
          logger.warn(`Failed to get all conversations - ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully retrieved all conversations`);
        return res
          .status(200)
          .json({ message: "All Conversations", result: result.conversations });
      } catch (err) {
        logger.error(`Error getting all conversations: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    createConversation: async (req, res) => {
      try {
        const result = await chatbotService.createConversation(req.body);
        if (!result.success) {
          logger.warn(`Failed to create conversation - ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully created conversation`);
        return res.status(201).json({
          message: "Conversation created",
          result: result.conversation,
        });
      } catch (err) {
        logger.error(`Error creating conversation: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updateConversation: async (req, res) => {
      try {
        const result = await chatbotService.updateConversation(
          req.params.id,
          req.body
        );
        if (!result.success) {
          logger.warn(
            `Failed to update conversation ID: ${req.params.id} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully updated conversation ID: ${req.params.id}`);
        return res.status(200).json({
          message: "Conversation updated",
          result: result.conversation,
        });
      } catch (err) {
        logger.error(`Error updating conversation: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    deleteConversation: async (req, res) => {
      try {
        const result = await chatbotService.deleteConversation(req.params.id);
        if (!result.success) {
          logger.warn(
            `Failed to delete conversation ID: ${req.params.id} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully deleted conversation ID: ${req.params.id}`);
        return res.status(200).json({ message: "Conversation deleted" });
      } catch (err) {
        logger.error(`Error deleting conversation: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    // Predictions
    getPredictionByID: async (req, res) => {
      try {
        const result = await chatbotService.findPredictionById(req.params.id);
        if (!result.success) {
          logger.warn(
            `Failed to get prediction by ID: ${req.params.id} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(
          `Successfully retrieved prediction by ID: ${req.params.id}`
        );
        return res
          .status(200)
          .json({ message: "Prediction", result: result.prediction });
      } catch (err) {
        logger.error(`Error getting prediction by ID: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    getPredictionsByConversationID: async (req, res) => {
      try {
        const result = await chatbotService.findPredictionsByConversationId(
          req.params.conversation_id
        );
        if (!result.success) {
          logger.warn(
            `Failed to get predictions by Conversation ID: ${req.params.conversation_id} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(
          `Successfully retrieved predictions by Conversation ID: ${req.params.conversation_id}`
        );
        return res
          .status(200)
          .json({ message: "Predictions", result: result.predictions });
      } catch (err) {
        logger.error(`Error getting predictions by Conversation ID: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    getAllPredictions: async (req, res) => {
      try {
        const result = await chatbotService.findAllPredictions();
        if (!result.success) {
          logger.warn(`Failed to get all predictions - ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully retrieved all predictions`);
        return res
          .status(200)
          .json({ message: "All Predictions", result: result.predictions });
      } catch (err) {
        logger.error(`Error getting all predictions: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    createPrediction: async (req, res) => {
      try {
        const result = await chatbotService.createPrediction(req.body);
        if (!result.success) {
          logger.warn(`Failed to create prediction - ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully created prediction`);
        return res
          .status(201)
          .json({ message: "Prediction created", result: result.prediction });
      } catch (err) {
        logger.error(`Error creating prediction: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updatePrediction: async (req, res) => {
      try {
        const result = await chatbotService.updatePrediction(
          req.params.id,
          req.body
        );
        if (!result.success) {
          logger.warn(
            `Failed to update prediction ID: ${req.params.id} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully updated prediction ID: ${req.params.id}`);
        return res
          .status(200)
          .json({ message: "Prediction updated", result: result.prediction });
      } catch (err) {
        logger.error(`Error updating prediction: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    deletePrediction: async (req, res) => {
      try {
        const result = await chatbotService.deletePrediction(req.params.id);
        if (!result.success) {
          logger.warn(
            `Failed to delete prediction ID: ${req.params.id} - ${result.error}`
          );
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully deleted prediction ID: ${req.params.id}`);
        return res.status(200).json({ message: "Prediction deleted" });
      } catch (err) {
        logger.error(`Error deleting prediction: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}
