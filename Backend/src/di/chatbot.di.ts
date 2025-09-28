import { container } from "tsyringe";
import {
  IChatbotRepository,
  ChatbotRepository,
} from "../repositories/chatbot.repository";
import { IChatbotService, chatbotService } from "../services/chatbot.service";
import {
  IChatbotController,
  chatbotController,
} from "../controllers/chatbot.controller";

container.register<IChatbotRepository>("ChatbotRepository", {
  useValue: ChatbotRepository,
});
container.register<IChatbotService>("ChatbotService", {
  useFactory: (c) =>
    chatbotService(c.resolve<IChatbotRepository>("ChatbotRepository")),
});
container.register<IChatbotController>("ChatbotController", {
  useFactory: (c) =>
    chatbotController(c.resolve<IChatbotService>("ChatbotService")),
});
export { container };
