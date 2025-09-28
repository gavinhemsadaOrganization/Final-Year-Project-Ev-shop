import { Request, Response } from "express";
import { INotificationService } from "../services/notification.service";

export interface INotificationController {
    getNotificationByID(req: Request, res: Response): Promise<Response>;
    getNotificationsByUserID(req: Request, res: Response): Promise<Response>;
    getAllNotifications(req: Request, res: Response): Promise<Response>;
    markNotificationAsRead(req: Request, res: Response): Promise<Response>;
    createNotification(req: Request, res: Response): Promise<Response>;
    updateNotification(req: Request, res: Response): Promise<Response>;
    deleteNotification(req: Request, res: Response): Promise<Response>;
}

export function notificationController(notificationService: INotificationService): INotificationController {
    return {
        getNotificationByID: async (req, res) => {
            try {
                const result = await notificationService.findById(req.params.id);
                if (!result.success) return res.status(400).json({ message: result.error });
                return res.status(200).json({ message: "Notification", result: result.notification });
            } catch (err) {
                return res.status(500).json({ error: err || "Internal server error" });
            }   
        },
        getNotificationsByUserID: async (req, res) => {
            try {
                const result = await notificationService.findByUserId(req.params.user_id);
                if (!result.success) return res.status(400).json({ message: result.error });
                return res.status(200).json({ message: "User Notifications", result: result.notifications });
            } catch (err) {
                return res.status(500).json({ error: err || "Internal server error" });
            }
        },
        getAllNotifications: async (_req, res) => {
            try {
                const result = await notificationService.findAll();
                if (!result.success) return res.status(400).json({ message: result.error });
                return res.status(200).json({ message: "All Notifications", result: result.notifications });
            }
            catch (err) {
                return res.status(500).json({ error: err || "Internal server error" });
            }
        },
        markNotificationAsRead: async (req, res) => {
            try {
                const result = await notificationService.markAsRead(req.params.id);
                if (!result.success) return res.status(400).json({ message: result.error });
                return res.status(200).json({ message: "Notification marked as read" });
            }
            catch (err) {
                return res.status(500).json({ error: err || "Internal server error" });
            }
        },
        createNotification: async (req, res) => {
            try {
                const data = req.body;
                const result = await notificationService.create(data);
                if (!result.success) return res.status(400).json({ message: result.error });
                return res.status(201).json({ message: "Notification created", result: result.notification });
            }   
            catch (err) {
                return res.status(500).json({ error: err || "Internal server error" });
            }
        },
        updateNotification: async (req, res) => {
            try {
                const data = req.body;
                const id = req.params.id;
                const result = await notificationService.update(id, data);
                if (!result.success) return res.status(400).json({ message: result.error });
                return res.status(200).json({ message: "Notification updated", result: result.notification });
            }   
            catch (err) {
                return res.status(500).json({ error: err || "Internal server error" });
            }
        },
        deleteNotification: async (req, res) => {
            try {
                const id = req.params.id; 
                const result = await notificationService.delete(id);
                if (!result.success) return res.status(400).json({ message: result.error });
                return res.status(200).json({ message: "Notification deleted" });
            }   
            catch (err) {
                return res.status(500).json({ error: err || "Internal server error" });
            }
        }
    };
}