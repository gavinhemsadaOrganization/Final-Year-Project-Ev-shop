import { validateDto } from "../../shared/middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IChatbotController } from "./chatbot.controller";
import { ChatbotConversationDTO, PredictionDTO } from "../../dtos/chatbot.DTO";
import { container } from "../../di/container";

/**
 * Factory function that creates and configures the router for chatbot-related endpoints.
 * It resolves the chatbot controller from the dependency injection container and maps
 * controller methods to specific API routes for conversations and predictions.
 *
 * @returns The configured Express Router for the chatbot.
 */
/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: Chatbot conversation and prediction management
 */
export const chatbotRouter = (): Router => {
  const router = Router();
  // Resolve the chatbot controller from the DI container.
  const chatbotController =
    container.resolve<IChatbotController>("ChatbotController");

  // --- Conversation Routes ---

  /**
   * @swagger
   * /chatbot/conversations/{id}:
   *   get:
   *     summary: Get conversation by ID
   *     description: Retrieves a single conversation entry by its unique ID.
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the conversation to retrieve.
   *     responses:
   *       '200':
   *         description: Successfully retrieved conversation.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 conversation:
   *                   type: object
   *                   properties:
   *                     _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                     user_id: { type: string, example: "60d0fe4f5e3e3e0015a8b456" }
   *                     messages: { type: array, items: { type: object, properties: { role: { type: string }, content: { type: string }, timestamp: { type: string, format: "date-time" } } } }
   *                     createdAt: { type: string, format: "date-time" }
   *                     updatedAt: { type: string, format: "date-time" }
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not owner or admin)
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Conversation not found
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/conversations/:id", (req, res) =>
    chatbotController.getConversationByID(req, res)
  );

  /**
   * @route GET /api/chatbot/conversations/user/:user_id
   * @swagger
   * /chatbot/conversations/user/{user_id}:
   *   get:
   *     summary: Get user's conversations
   *     description: Retrieves all conversation entries for a specific user.
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user whose conversations are to be retrieved.
   *     responses:
   *       '200':
   *         description: Successfully retrieved user's conversations.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 conversations:
   *                   type: array
   *                   items:
   *                     type: object # Ideally $ref: '#/components/schemas/ChatbotConversation'
   *                     properties:
   *                       _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                       user_id: { type: string, example: "60d0fe4f5e3e3e0015a8b456" }
   *                       # ... other conversation properties
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not owner or admin)
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/conversations/user/:user_id", (req, res) =>
    chatbotController.getConversationsByUserID(req, res)
  );

  /**
   * @route GET /api/chatbot/conversations
   * @swagger
   * /chatbot/conversations:
   *   get:
   *     summary: Get all conversations
   *     description: Retrieves a list of all conversations. (Typically restricted to Admins)
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Successfully retrieved all conversations.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 conversations:
   *                   type: array
   *                   items:
   *                     type: object # Ideally $ref: '#/components/schemas/ChatbotConversation'
   *                     properties:
   *                       _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                       user_id: { type: string, example: "60d0fe4f5e3e3e0015a8b456" }
   *                       # ... other conversation properties
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not admin)
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/conversations", (req, res) =>
    chatbotController.getAllConversations(req, res)
  );

  /**
   * @swagger
   * /chatbot/ask:
   *   post:
   *     summary: Get chatbot response
   *     description: Sends a question to the chatbot and gets a direct response.
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [question]
   *             properties:
   *               question:
   *                 type: string
   *                 example: "What is the range of the Tesla Model 3?"
   *     responses:
   *       '200':
   *         description: Successfully received chatbot response.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 response:
   *                   type: string
   *                   example: "The Tesla Model 3 Long Range has an estimated range of 333 miles (536 km) on a full charge."
   *       '400':
   *         description: Bad request (e.g., missing question)
   *         $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.post("/ask", (req, res) => chatbotController.getRespons(req, res));

  /**
   * @swagger
   * /chatbot/conversations:
   *   post:
   *     summary: Create a new conversation
   *     description: Creates a new conversation entry (logs a user's message).
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChatbotConversationDTO' # Assumes ChatbotConversationDTO is defined in swagger.config.ts
   *     responses:
   *       '201':
   *         description: Conversation created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 conversation:
   *                   type: object # Ideally $ref: '#/components/schemas/ChatbotConversation'
   *                   properties:
   *                     _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                     user_id: { type: string, example: "60d0fe4f5e3e3e0015a8b456" }
   *                     messages: { type: array, items: { type: object } }
   *       '400':
   *         description: Bad request (validation error)
   *         $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.post(
    "/conversations",
    validateDto(ChatbotConversationDTO),
    (req, res) => chatbotController.createConversation(req, res)
  );

  /**
   * @swagger
   * /chatbot/conversations/{id}:
   *   put:
   *     summary: Update a conversation
   *     description: Updates an existing conversation entry.
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the conversation to update.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChatbotConversationDTO' # Assumes ChatbotConversationDTO is defined in swagger.config.ts
   *     responses:
   *       '200':
   *         description: Conversation updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 conversation:
   *                   type: object # Ideally $ref: '#/components/schemas/ChatbotConversation'
   *                   properties:
   *                     _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                     # ... other conversation properties
   *       '400':
   *         description: Bad request (validation error)
   *         $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Conversation not found
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.put(
    "/conversations/:id",
    validateDto(ChatbotConversationDTO),
    (req, res) => chatbotController.updateConversation(req, res)
  );

  /**
   * @swagger
   * /chatbot/conversations/{id}:
   *   delete:
   *     summary: Delete a conversation
   *     description: Deletes a conversation entry by its unique ID.
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the conversation to delete.
   *     responses:
   *       '200':
   *         description: Conversation deleted successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Conversation deleted successfully
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not owner or admin)
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Conversation not found
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.delete("/conversations/:id", (req, res) =>
    chatbotController.deleteConversation(req, res)
  );

  // --- Prediction Routes ---

  /**
   * @swagger
   * /chatbot/predictions/{id}:
   *   get:
   *     summary: Get prediction by ID
   *     description: Retrieves a single prediction record by its unique ID. (Typically restricted to Admins)
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the prediction to retrieve.
   *     responses:
   *       '200':
   *         description: Successfully retrieved prediction.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 prediction:
   *                   type: object # Ideally $ref: '#/components/schemas/Prediction'
   *                   properties:
   *                     _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45b" }
   *                     conversation_id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                     input_text: { type: string, example: "What is the range of the Tesla Model 3?" }
   *                     predicted_category: { type: string, example: "Vehicle_Specs" }
   *                     confidence: { type: number, format: float, example: 0.95 }
   *                     createdAt: { type: string, format: "date-time" }
   *                     updatedAt: { type: string, format: "date-time" }
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not admin)
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Prediction not found
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/predictions/:id", (req, res) =>
    chatbotController.getPredictionByID(req, res)
  );

  /**
   * @swagger
   * /chatbot/predictions/conversation/{conversation_id}:
   *   get:
   *     summary: Get predictions for a conversation
   *     description: Retrieves all prediction records for a specific conversation. (Typically restricted to Admins)
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conversation_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the conversation to retrieve predictions for.
   *     responses:
   *       '200':
   *         description: Successfully retrieved predictions for the conversation.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 predictions:
   *                   type: array
   *                   items:
   *                     type: object # Ideally $ref: '#/components/schemas/Prediction'
   *                     properties:
   *                       _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45b" }
   *                       conversation_id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                       # ... other prediction properties
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not admin)
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Conversation not found
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/predictions/conversation/:conversation_id", (req, res) =>
    chatbotController.getPredictionsByConversationID(req, res)
  );

  /**
   * @swagger
   * /chatbot/predictions:
   *   get:
   *     summary: Get all predictions
   *     description: Retrieves a list of all prediction records. (Typically restricted to Admins)
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Successfully retrieved all predictions.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 predictions:
   *                   type: array
   *                   items:
   *                     type: object # Ideally $ref: '#/components/schemas/Prediction'
   *                     properties:
   *                       _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45b" }
   *                       conversation_id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                       # ... other prediction properties
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not admin)
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.get("/predictions", (req, res) =>
    chatbotController.getAllPredictions(req, res)
  );

  /**
   * @swagger
   * /chatbot/predictions:
   *   post:
   *     summary: Create a new prediction
   *     description: Creates a new prediction record. (Typically called internally by the chatbot service)
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PredictionDTO' # Assumes PredictionDTO is defined in swagger.config.ts
   *     responses:
   *       '201':
   *         description: Prediction created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 prediction:
   *                   type: object # Ideally $ref: '#/components/schemas/Prediction'
   *                   properties:
   *                     _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45b" }
   *                     conversation_id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                     # ... other prediction properties
   *       '400':
   *         description: Bad request (validation error)
   *         $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.post("/predictions", validateDto(PredictionDTO), (req, res) =>
    chatbotController.createPrediction(req, res)
  );

  /**
   * @swagger
   * /chatbot/predictions/{id}:
   *   put:
   *     summary: Update a prediction
   *     description: Updates an existing prediction record. (Typically restricted to Admins)
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the prediction to update.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PredictionDTO' # Assumes PredictionDTO is defined in swagger.config.ts
   *     responses:
   *       '200':
   *         description: Prediction updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 prediction:
   *                   type: object # Ideally $ref: '#/components/schemas/Prediction'
   *                   properties:
   *                     _id: { type: string, example: "60d0fe4f5e3e3e0015a8b45b" }
   *                     conversation_id: { type: string, example: "60d0fe4f5e3e3e0015a8b45a" }
   *                     # ... other prediction properties
   *       '400':
   *         description: Bad request (validation error)
   *         $ref: '#/components/schemas/Error'
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Prediction not found
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.put("/predictions/:id", validateDto(PredictionDTO), (req, res) =>
    chatbotController.updatePrediction(req, res)
  );

  /**
   * @swagger
   * /chatbot/predictions/{id}:
   *   delete:
   *     summary: Delete a prediction
   *     description: Deletes a prediction record by its unique ID. (Typically restricted to Admins)
   *     tags: [Chatbot]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the prediction to delete.
   *     responses:
   *       '200':
   *         description: Prediction deleted successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Prediction deleted successfully
   *       '401':
   *         description: Unauthorized
   *         $ref: '#/components/schemas/Error'
   *       '403':
   *         description: Forbidden (if user is not admin)
   *         $ref: '#/components/schemas/Error'
   *       '404':
   *         description: Prediction not found
   *         $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         $ref: '#/components/schemas/Error'
   */
  router.delete("/predictions/:id", (req, res) =>
    chatbotController.deletePrediction(req, res)
  );
  return router;
};
