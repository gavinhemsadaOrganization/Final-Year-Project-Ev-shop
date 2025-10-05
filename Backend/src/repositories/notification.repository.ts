import { INotification, Notification } from "../models/Notification";
import { NotificationDTO } from "../dtos/notification.DTO";
import { withErrorHandling } from "../utils/CustomException";

export interface INotificationRepository {
  create(data: NotificationDTO): Promise<INotification | null>;
  findById(id: string): Promise<INotification | null>;
  findByUserId(user_id: string): Promise<INotification[] | null>;
  findAll(): Promise<INotification[] | null>;
  notificationReaded(id: string): Promise<boolean | null>;
  update(id: string, data: INotification): Promise<INotification | null>;
  delete(id: string): Promise<boolean | null>;
}

export const NotificationRepository: INotificationRepository = {
  create: withErrorHandling(async (data) => {
    const notification = new Notification(data);
    return await notification.save();
  }),
  findById: withErrorHandling(async (id) => {
    return await Notification.findOne({ _id: id });
  }),
  findByUserId: withErrorHandling(async (user_id) => {
    return await Notification.find({ user_id });
  }),
  findAll: withErrorHandling(async () => {
    return await Notification.find();
  }),
  notificationReaded: withErrorHandling(async (id) => {
    const notification = await Notification.findById(id);
    notification!.is_read = true;
    await notification!.save();
    return true;
  }),
  update: withErrorHandling(async (id, data) => {
    return await Notification.findByIdAndUpdate(id, data);
  }),
  delete: withErrorHandling(async (id) => {
    const deleted = await Notification.findByIdAndDelete(id);
    return deleted !== null;
  }),
};
