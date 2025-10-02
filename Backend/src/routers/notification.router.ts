import { validateDto } from "../middlewares/DtoValidator.middleware";
import { Router } from "express";
import { INotificationController } from "../controllers/notification.controller";
import { NotificationDTO } from "../dtos/notification.DTO";
import { container } from "../di/notification.di";

export const notificationRouter = (): Router => {
  const router = Router();
  const notificationController = container.resolve<INotificationController>(
    "NotificationController"
  );

  router.get("/:id", (req, res) =>
    notificationController.getNotificationByID(req, res)
  );
  
  router.get("/:user_id", (req, res) =>
    notificationController.getNotificationsByUserID(req, res)
  );


  router.get("/", (req, res) =>
    notificationController.getAllNotifications(req, res)
  );

  router.put("/:id/read", (req, res) =>
    notificationController.markNotificationAsRead(req, res)
  );
 
  router.post("/", validateDto(NotificationDTO), (req, res) =>
    notificationController.createNotification(req, res)
  );
 
  router.put("/:id", validateDto(NotificationDTO), (req, res) =>
    notificationController.updateNotification(req, res)
  );
 
  router.delete("/:id", (req, res) =>
    notificationController.deleteNotification(req, res)
  );
  return router;
};
