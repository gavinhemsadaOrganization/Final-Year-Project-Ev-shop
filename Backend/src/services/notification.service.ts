import {INotificationRepository} from "../repositories/notification.repository";
import { NotificationDTO } from "../dtos/notification.DTO";

export interface INotificationService{
    findById(id: string): Promise<{success: boolean; notification?: any; error?: string}>;
    findByUserId(user_id: string): Promise<{success: boolean; notifications?: any[]; error?: string}>;
    findAll(): Promise<{success: boolean; notifications?: any[]; error?: string}>;
    create(data: NotificationDTO): Promise<{success: boolean; notification?: any; error?: string}>;
    markAsRead(id: string): Promise<{success: boolean; error?: string}>;
    update(id: string, data: Partial<NotificationDTO>): Promise<{success: boolean; notification?: any; error?: string}>;
    delete(id: string): Promise<{success: boolean; error?: string}>;
}
export function notificationService(notificationRepo: INotificationRepository): INotificationService{
    return {
        findById: async (id) => {
            try{
                const notification = await notificationRepo.findById(id);
                if(!notification) return {success: false, error: "Notification not found"};
                return {success: true, notification};
            }
            catch(err){
                return {success: false, error: "Failed to fetch notification"};
            }
        },
        findByUserId: async (user_id) => {
            try{
                const notifications = await notificationRepo.findByUserId(user_id);
                if(!notifications) return {success: false, error: "No notifications found for this user"};
                return {success: true, notifications};
            }
            catch(err){
                return {success: false, error: "Failed to fetch notifications"};
            }
        },
        findAll: async () => {
            try{
                const notifications = await notificationRepo.findAll();
                if(!notifications) return {success: false, error: "No notifications found"};
                return {success: true, notifications};
            }
            catch(err){
                return {success: false, error: "Failed to fetch notifications"};
            }
        },
        create: async (data) => {
            try{
                const notification = await notificationRepo.create(data);
                return {success: true, notification};
            }
            catch(err){
                return {success: false, error: "Failed to create notification"};
            }
        },
        markAsRead: async (id) => {
            try{    
                const success = await notificationRepo.notificationReaded(id);
                if(!success) return {success: false, error: "Notification not found"};
                return {success: true};
            }
            catch(err){
                return {success: false, error: "Failed to mark notification as read"};
            }
        },
        update: async (id, data) => {
            try{
                const existingNotification = await notificationRepo.findById(id);
                if(!existingNotification) return {success: false, error: "Notification not found"};
                Object.assign(existingNotification, data);
                const notification = await notificationRepo.update(id, existingNotification);
                if(!notification) return {success: false, error: "Notification not found"};
                return {success: true, notification};
            }
            catch(err){
                return {success: false, error: "Failed to update notification"};
            }
        },
        delete: async (id) => {
            try{
                const success = await notificationRepo.delete(id);
                if(!success) return {success: false, error: "Notification not found"};
                return {success: true};
            }
            catch(err){
                return {success: false, error: "Failed to delete notification"};
            }
        }
        
    }
}