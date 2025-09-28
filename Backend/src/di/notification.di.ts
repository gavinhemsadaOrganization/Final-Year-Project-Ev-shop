import { container } from "tsyringe";
import {INotificationRepository, NotificationRepository} from "../repositories/notification.repository";
import { INotificationService, notificationService } from "../services/notification.service";
import { INotificationController, notificationController } from "../controllers/notification.controller";

container.register<INotificationRepository>("NotificationRepository", {
    useValue: NotificationRepository,
});
container.register<INotificationService>("NotificationService", {
    useFactory: (c) => notificationService(c.resolve<INotificationRepository>("NotificationRepository")),
});
container.register<INotificationController>("NotificationController", {
    useFactory: (c) => notificationController(c.resolve<INotificationService>("NotificationService")),
});
export { container };