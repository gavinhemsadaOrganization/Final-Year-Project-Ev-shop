import { INotification, Notification } from "../models/Notification";
import { NotificationDTO } from "../dtos/notification.DTO";

export interface INotificationRepository {
  create(data: NotificationDTO): Promise<INotification>;
  findById(id: string): Promise<INotification | null>;
  findByUserId(user_id: string): Promise<INotification[] | null>;
  findAll(): Promise<INotification[] | null>;
  notificationReaded(id: string): Promise<boolean>;
  update(id: string, data: INotification): Promise<INotification | null>;
  delete(id: string): Promise<boolean>;
}

export const NotificationRepository: INotificationRepository = {
  create: async (data) => {
    const notification = new Notification(data);
    return await notification.save();
  },
  findById: async (id) => {
    return await Notification.findOne({ _id: id });
  },
  findByUserId: async (user_id) => {
    return await Notification.find({ user_id });
  },
  findAll: async () => {
    return await Notification.find();
  },
  notificationReaded: async (id) => {
    const notification = await Notification.findById(id);
    notification!.is_read = true;
    await notification!.save();
    return true;
  },
  update: async (id, data) => {
    return await Notification.findByIdAndUpdate(id, data);
  },
  delete: async (id) => {
    const deleted = await Notification.findByIdAndDelete(id);
    return deleted !== null;
  },
};
