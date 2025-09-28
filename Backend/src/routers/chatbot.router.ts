import { validateDto } from "../middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IChatbotController } from "../controllers/chatbot.controller";
import { ChatbotConversationDTO, PredictionDTO } from "../dtos/chatbot.DTO";
import { container } from "../di/chatbot.di";

export const chatbotRouter = (): Router => {
  const router = Router();
  const chatbotController =
    container.resolve<IChatbotController>("ChatbotController");
  router.get("/conversations/:id", (req, res) =>
    chatbotController.getConversationByID(req, res)
  );
  router.get("/conversations/user/:user_id", (req, res) =>
    chatbotController.getConversationsByUserID(req, res)
  );
  router.get("/conversations", (req, res) =>
    chatbotController.getAllConversations(req, res)
  );
  router.post(
    "/conversations",
    validateDto(ChatbotConversationDTO),
    (req, res) => chatbotController.createConversation(req, res)
  );
  router.put(
    "/conversations/:id",
    validateDto(ChatbotConversationDTO),
    (req, res) => chatbotController.updateConversation(req, res)
  );
  router.delete("/conversations/:id", (req, res) =>
    chatbotController.deleteConversation(req, res)
  );

  router.get("/predictions/:id", (req, res) =>
    chatbotController.getPredictionByID(req, res)
  );
  router.get("/predictions/conversation/:conversation_id", (req, res) =>
    chatbotController.getPredictionsByConversationID(req, res)
  );
  router.get("/predictions", (req, res) =>
    chatbotController.getAllPredictions(req, res)
  );
  router.post("/predictions", validateDto(PredictionDTO), (req, res) =>
    chatbotController.createPrediction(req, res)
  );
  router.put("/predictions/:id", validateDto(PredictionDTO), (req, res) =>
    chatbotController.updatePrediction(req, res)
  );
  router.delete("/predictions/:id", (req, res) =>
    chatbotController.deletePrediction(req, res)
  );
  return router;
};
