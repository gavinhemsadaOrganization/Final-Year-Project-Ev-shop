import { INotificationRepository } from "./notification.repository";
import { NotificationDTO } from "../../dtos/notification.DTO";
import { IUserRepository } from "../user/user.repository";
import CacheService from "../../shared/cache/CacheService";

/**
 * Defines the interface for the notification service, outlining methods for managing user notifications.
 */
export interface INotificationService {
  /**
   * Finds a single notification by its unique ID.
   * @param id - The ID of the notification to find.
   * @returns A promise that resolves to an object containing the notification data or an error.
   */
  findById(
    id: string
  ): Promise<{ success: boolean; notification?: any; error?: string }>;
  /**
   * Finds all notifications for a specific user.
   * @param user_id - The ID of the user.
   * @returns A promise that resolves to an object containing an array of the user's notifications or an error.
   */
  findByUserId(
    user_id: string
  ): Promise<{ success: boolean; notifications?: any[]; error?: string }>;
  /**
   * Retrieves all notifications from the system.
   * @returns A promise that resolves to an object containing an array of all notifications or an error.
   */
  findAll(): Promise<{
    success: boolean;
    notifications?: any[];
    error?: string;
  }>;
  /**
   * Creates a new notification.
   * @param data - The data for the new notification.
   * @returns A promise that resolves to an object containing the created notification or an error.
   */
  create(
    data: NotificationDTO
  ): Promise<{ success: boolean; notification?: any; error?: string }>;
  /**
   * Marks a specific notification as read.
   * @param id - The ID of the notification to mark as read.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  markAsRead(id: string): Promise<{ success: boolean; error?: string }>;
  /**
   * Updates an existing notification.
   * @param id - The ID of the notification to update.
   * @param data - The partial data to update the notification with.
   * @returns A promise that resolves to an object containing the updated notification data or an error.
   */
  update(
    id: string,
    data: Partial<NotificationDTO>
  ): Promise<{ success: boolean; notification?: any; error?: string }>;
  /**
   * Deletes a notification by its unique ID.
   * @param id - The ID of the notification to delete.
   * @returns A promise that resolves to an object indicating success or failure.
   */
  delete(id: string): Promise<{ success: boolean; error?: string }>;
}
/**
 * Factory function to create an instance of the notification service.
 * It encapsulates the business logic for managing notifications, including caching strategies
 * to improve performance.
 *
 * @param notificationRepo - The repository for notification data access.
 * @param userRepo - The repository for user data access.
 * @returns An implementation of the INotificationService interface.
 */
export function notificationService(
  notificationRepo: INotificationRepository,
  userRepo: IUserRepository
): INotificationService {
  return {
    findById: async (id) => {
      try {
        /**
         * Finds a single notification by its ID, using a cache-aside pattern.
         * Caches the individual notification data for one hour.
         */
        const cacheKey = `notification_${id}`;
        const notification = await CacheService.getOrSet(
          cacheKey,
          async () => {
            const notificationData = await notificationRepo.findById(id);
            return notificationData ?? null;
          },
          3600 // Cache for 1 hour
        );
        if (!notification)
          return { success: false, error: "Notification not found" };
        return { success: true, notification };
      } catch (err) {
        return { success: false, error: "Failed to fetch notification" };
      }
    },
    findByUserId: async (user_id) => {
      try {
        /**
         * Finds all notifications for a specific user, using a cache-aside pattern.
         * Caches the list of notifications for that user for one hour.
         */
        const cacheKey = `notifications_user_${user_id}`;
        const notifications = await CacheService.getOrSet(
          cacheKey,
          async () => {
            const notificationsData = await notificationRepo.findByUserId(
              user_id
            );
            return notificationsData ?? [];
          },
          3600 // Cache for 1 hour
        );
        if (!notifications)
          return {
            success: false,
            error: "No notifications found for this user",
          };
        return { success: true, notifications };
      } catch (err) {
        return { success: false, error: "Failed to fetch notifications" };
      }
    },
    findAll: async () => {
      try {
        /**
         * Retrieves all notifications, utilizing a cache-aside pattern.
         * Caches the list of all notifications for one hour.
         */
        const cacheKey = "notifications";
        const notifications = await CacheService.getOrSet(
          cacheKey,
          async () => {
            const notificationsData = await notificationRepo.findAll();
            return notificationsData ?? [];
          },
          3600 // Cache for 1 hour
        );
        if (!notifications)
          return { success: false, error: "No notifications found" };
        return { success: true, notifications };
      } catch (err) {
        return { success: false, error: "Failed to fetch notifications" };
      }
    },
    create: async (data) => {
      /**
       * Creates a new notification after validating the user exists.
       * It invalidates relevant notification caches to ensure data consistency.
       */
      try {
        const user = await userRepo.findById(data.user_id);
        if (!user) return { success: false, error: "User not found" };
        const notification = await notificationRepo.create(data);

        // Invalidate relevant caches
        await Promise.all([
          CacheService.delete("notifications"),
          CacheService.delete(`notifications_user_${data.user_id}`),
        ]);

        return { success: true, notification };
      } catch (err) {
        return { success: false, error: "Failed to create notification" };
      }
    },
    markAsRead: async (id) => {
      /**
       * Marks a notification as read.
       * It invalidates all caches related to this notification upon successful update.
       */
      try {
        const notification = await notificationRepo.findById(id);
        if (!notification)
          return { success: false, error: "Notification not found" };

        const success = await notificationRepo.notificationReaded(id);
        if (!success)
          return { success: false, error: "Notification not found" };

        // Invalidate relevant caches
        await Promise.all([
          CacheService.delete(`notification_${id}`),
          CacheService.delete("notifications"),
          CacheService.delete(`notifications_user_${notification.user_id}`),
        ]);

        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: "Failed to mark notification as read",
        };
      }
    },
    update: async (id, data) => {
      /**
       * Updates an existing notification's data.
       * It invalidates all caches related to this notification upon successful update.
       */
      try {
        const existingNotification = await notificationRepo.findById(id);
        if (!existingNotification)
          return { success: false, error: "Notification not found" };
        // Apply the partial updates to the existing notification object.
        Object.assign(existingNotification, data);
        const notification = await notificationRepo.update(
          id,
          existingNotification
        );
        if (!notification)
          return { success: false, error: "Notification not found" };

        // Invalidate relevant caches
        await Promise.all([
          CacheService.delete(`notification_${id}`),
          CacheService.delete("notifications"),
          CacheService.delete(
            `notifications_user_${existingNotification.user_id}`
          ),
        ]);
        return { success: true, notification };
      } catch (err) {
        return { success: false, error: "Failed to update notification" };
      }
    },
    delete: async (id) => {
      /**
       * Deletes a notification from the system.
       * It invalidates all caches related to this notification before deletion.
       */
      try {
        const notification = await notificationRepo.findById(id);
        if (!notification)
          return { success: false, error: "Notification not found" };

        const success = await notificationRepo.delete(id);
        if (!success)
          return { success: false, error: "Notification not found" };

        // Invalidate relevant caches
        await Promise.all([
          CacheService.delete(`notification_${id}`),
          CacheService.delete("notifications"),
          CacheService.delete(`notifications_user_${notification.user_id}`),
        ]);

        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete notification" };
      }
    },
  };
}
