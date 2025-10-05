import { Request, Response } from "express";
import { IChatbotService } from "../services/chatbot.service";
import { handleResult, handleError } from "../utils/Respons.util";
import { get } from "http";

export interface IChatbotController {
  getConversationByID(req: Request, res: Response): Promise<Response>;
  getConversationsByUserID(req: Request, res: Response): Promise<Response>;
  getAllConversations(req: Request, res: Response): Promise<Response>;
  getRespons(req: Request, res: Response): Promise<Response>;
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
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getConversationByID");
      }
    },
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
    getAllConversations: async (req, res) => {
      try {
        const result = await chatbotService.findAllConversations();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllConversations");
      }
    },
    getRespons: async (req, res) => {
      try {
        const result = await chatbotService.getRespons(req.body.question);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getRespons");
      }
    },
    createConversation: async (req, res) => {
      try {
        const result = await chatbotService.createConversation(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createConversation");
      }
    },
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
    deleteConversation: async (req, res) => {
      try {
        const result = await chatbotService.deleteConversation(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteConversation");
      }
    },
    // Predictions
    getPredictionByID: async (req, res) => {
      try {
        const result = await chatbotService.findPredictionById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getPredictionByID");
      }
    },
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
    getAllPredictions: async (req, res) => {
      try {
        const result = await chatbotService.findAllPredictions();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllPredictions");
      }
    },
    createPrediction: async (req, res) => {
      try {
        const result = await chatbotService.createPrediction(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createPrediction");
      }
    },
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
