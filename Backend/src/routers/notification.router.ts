import { validateDto } from "../middlewares/DtoValidator.middleware";
import { Router } from "express";
import { INotificationController } from "../controllers/notification.controller";
import { NotificationDTO } from "../dtos/notification.DTO";
import { container } from "../di/container";

/**
 * Factory function that creates and configures the router for notification-related endpoints.
 * It resolves the notification controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for notification management.
 */
export const notificationRouter = (): Router => {
  const router = Router();
  // Resolve the notification controller from the DI container.
  const notificationController = container.resolve<INotificationController>(
    "NotificationController"
  );

  /**
   * @route GET /api/notifications/:id
   * @description Retrieves a single notification by its unique ID.
   * @access Private (User who owns the notification, or Admin)
   */
  router.get("/:id", (req, res) =>
    notificationController.getNotificationByID(req, res)
  );

  /**
   * @route GET /api/notifications/:user_id
   * @description Retrieves all notifications for a specific user.
   * @warning This route is currently unreachable due to the preceding `/:id` route.
   *          Consider changing the path to `/user/:user_id` to resolve the conflict.
   * @access Private (User can get their own notifications, or Admin)
   */
  router.get("/:user_id", (req, res) =>
    notificationController.getNotificationsByUserID(req, res)
  );

  /**
   * @route GET /api/notifications/
   * @description Retrieves a list of all notifications.
   * @access Private (Typically restricted to Admins)
   */
  router.get("/", (req, res) =>
    notificationController.getAllNotifications(req, res)
  );

  /**
   * @route PUT /api/notifications/:id/read
   * @description Marks a specific notification as read.
   * @access Private (User who owns the notification)
   */
  router.put("/:id/read", (req, res) =>
    notificationController.markNotificationAsRead(req, res)
  );

  /**
   * @route POST /api/notifications/
   * @description Creates a new notification.
   * @middleware validateDto(NotificationDTO) - Validates the request body.
   * @access Private (Typically called internally by other services)
   */
  router.post("/", validateDto(NotificationDTO), (req, res) =>
    notificationController.createNotification(req, res)
  );

  /**
   * @route PUT /api/notifications/:id
   * @description Updates an existing notification.
   * @middleware validateDto(NotificationDTO) - Validates the request body.
   * @access Private (Typically restricted to Admins)
   */
  router.put("/:id", validateDto(NotificationDTO), (req, res) =>
    notificationController.updateNotification(req, res)
  );

  /**
   * @route DELETE /api/notifications/:id
   * @description Deletes a notification by its unique ID.
   * @access Private (User who owns the notification, or Admin)
   */
  router.delete("/:id", (req, res) =>
    notificationController.deleteNotification(req, res)
  );
  return router;
};
