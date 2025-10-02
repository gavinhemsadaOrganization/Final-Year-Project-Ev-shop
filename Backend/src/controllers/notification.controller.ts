import { Request, Response } from "express";
import { INotificationService } from "../services/notification.service";
import { handleResult, handleError } from "../utils/Respons.util";

export interface INotificationController {
  getNotificationByID(req: Request, res: Response): Promise<Response>;
  getNotificationsByUserID(req: Request, res: Response): Promise<Response>;
  getAllNotifications(req: Request, res: Response): Promise<Response>;
  markNotificationAsRead(req: Request, res: Response): Promise<Response>;
  createNotification(req: Request, res: Response): Promise<Response>;
  updateNotification(req: Request, res: Response): Promise<Response>;
  deleteNotification(req: Request, res: Response): Promise<Response>;
}

export function notificationController(
  notificationService: INotificationService
): INotificationController {
  return {
    getNotificationByID: async (req, res) => {
      try {
        const result = await notificationService.findById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getNotificationByID");
      }
    },
    getNotificationsByUserID: async (req, res) => {
      try {
        const result = await notificationService.findByUserId(
          req.params.user_id
        );
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getNotificationsByUserID");
      }
    },
    getAllNotifications: async (_req, res) => {
      try {
        const result = await notificationService.findAll();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllNotifications");
      }
    },
    markNotificationAsRead: async (req, res) => {
      try {
        const result = await notificationService.markAsRead(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "markNotificationAsRead");
      }
    },
    createNotification: async (req, res) => {
      try {
        const data = req.body;
        const result = await notificationService.create(data);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createNotification");
      }
    },
    updateNotification: async (req, res) => {
      try {
        const data = req.body;
        const id = req.params.id;
        const result = await notificationService.update(id, data);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateNotification");
      }
    },
    deleteNotification: async (req, res) => {
      try {
        const id = req.params.id;
        const result = await notificationService.delete(id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleteNotification");
      }
    },
  };
}
