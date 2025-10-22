// src/di/container.ts
import { container } from "tsyringe";

// ============================================================================
// REPOSITORY IMPORTS
// ============================================================================
import { IUserRepository, UserRepository } from "../repositories/user.repository";
import { ICartRepository, CartRepository } from "../repositories/cart.repository";
import { IChatbotRepository, ChatbotRepository } from "../repositories/chatbot.repository";
import { IEvRepository, EvRepository } from "../repositories/ev.repository";
import { IFinancialRepository, FinancialRepository } from "../repositories/financial.repository";
import { IMaintenanceRecordRepository, MaintenanceRecordRepository } from "../repositories/maintenanceRecord.repository";
import { INotificationRepository, NotificationRepository } from "../repositories/notification.repository";
import { IOrderRepository, OrderRepository } from "../repositories/order.repository";
import { IPaymentRepository, PaymentRepository } from "../repositories/payment.repository";
import { IPostRepository, PostRepository } from "../repositories/post.repository";
import { IReviewRepository, ReviewRepository } from "../repositories/review.repository";
import { ISellerRepository, SellerRepository } from "../repositories/seller.repository";
import { ITestDriveRepository, TestDriveRepository } from "../repositories/testDrive.repository";

// ============================================================================
// SERVICE IMPORTS
// ============================================================================
import { IUserService, userService } from "../services/user.service";
import { ICartService, cartService } from "../services/cart.service";
import { IChatbotService, chatbotService } from "../services/chatbot.service";
import { IEvService, evService } from "../services/ev.service";
import { IFinancialService, financialService } from "../services/financial.service";
import { IMaintenanceRecordService, maintenanceRecordService } from "../services/maintenanceRecord.service";
import { INotificationService, notificationService } from "../services/notification.service";
import { IOrderService, orderService } from "../services/order.service";
import { IPaymentService, paymentService } from "../services/payment.service";
import { IPostService, postService } from "../services/post.service";
import { IReviewService, reviewService } from "../services/review.service";
import { ISellerService, sellerService } from "../services/seller.service";
import { ITestDriveService, testDriveService } from "../services/testDrive.service";

// ============================================================================
// CONTROLLER IMPORTS
// ============================================================================
import { IUserController, userController } from "../controllers/user.controller";
import { ICartController, cartController } from "../controllers/cart.controller";
import { IChatbotController, chatbotController } from "../controllers/chatbot.controller";
import { IEvController, evController } from "../controllers/ev.controller";
import { IFinancialController, financialController } from "../controllers/financial.controller";
import { IMaintenanceRecordController, maintenanceRecordController } from "../controllers/maintenanceRecord.controller";
import { INotificationController, notificationController } from "../controllers/notification.controller";
import { IOrderController, orderController } from "../controllers/order.controller";
import { IPaymentController, paymentController } from "../controllers/payment.controller";
import { IPostController, postController } from "../controllers/post.controller";
import { IReviewController, reviewController } from "../controllers/review.controller";
import { ISellerController, sellerController } from "../controllers/seller.controller";
import { ITestDriveController, testDriveController } from "../controllers/testDrive.controller";

/**
 * Central Dependency Injection Container
 * 
 * Registers all application dependencies using tsyringe.
 * Organized by layer: Repositories → Services → Controllers
 */

// ============================================================================
// REPOSITORIES
// ============================================================================
container.register<IUserRepository>("UserRepository", { useValue: UserRepository });
container.register<ICartRepository>("CartRepository", { useValue: CartRepository });
container.register<IChatbotRepository>("ChatbotRepository", { useValue: ChatbotRepository });
container.register<IEvRepository>("EvRepository", { useValue: EvRepository });
container.register<IFinancialRepository>("FinancialRepository", { useValue: FinancialRepository });
container.register<IMaintenanceRecordRepository>("MaintenanceRecordRepository", { useValue: MaintenanceRecordRepository });
container.register<INotificationRepository>("NotificationRepository", { useValue: NotificationRepository });
container.register<IOrderRepository>("OrderRepository", { useValue: OrderRepository });
container.register<IPaymentRepository>("PaymentRepository", { useValue: PaymentRepository });
container.register<IPostRepository>("PostRepository", { useValue: PostRepository });
container.register<IReviewRepository>("ReviewRepository", { useValue: ReviewRepository });
container.register<ISellerRepository>("SellerRepository", { useValue: SellerRepository });
container.register<ITestDriveRepository>("TestDriveRepository", { useValue: TestDriveRepository });

// ============================================================================
// SERVICES
// ============================================================================
container.register<IUserService>("UserService", {
  useFactory: (c) => userService(c.resolve<IUserRepository>("UserRepository")),
});

container.register<ICartService>("CartService", {
  useFactory: (c) => cartService(c.resolve<ICartRepository>("CartRepository")),
});

container.register<IChatbotService>("ChatbotService", {
  useFactory: (c) =>
    chatbotService(
      c.resolve<IChatbotRepository>("ChatbotRepository"),
      c.resolve<IUserRepository>("UserRepository")
    ),
});

container.register<IEvService>("EvService", {
  useFactory: (c) =>
    evService(
      c.resolve<IEvRepository>("EvRepository"),
      c.resolve<ISellerRepository>("SellerRepository")
    ),
});

container.register<IFinancialService>("FinancialService", {
  useFactory: (c) =>
    financialService(
      c.resolve<IFinancialRepository>("FinancialRepository"),
      c.resolve<IUserRepository>("UserRepository")
    ),
});

container.register<IMaintenanceRecordService>("MaintenanceRecordService", {
  useFactory: (c) =>
    maintenanceRecordService(
      c.resolve<IMaintenanceRecordRepository>("MaintenanceRecordRepository"),
      c.resolve<ISellerRepository>("SellerRepository")
    ),
});

container.register<INotificationService>("NotificationService", {
  useFactory: (c) =>
    notificationService(
      c.resolve<INotificationRepository>("NotificationRepository"),
      c.resolve<IUserRepository>("UserRepository")
    ),
});

container.register<IOrderService>("OrderService", {
  useFactory: (c) => orderService(c.resolve<IOrderRepository>("OrderRepository")),
});

container.register<IPaymentService>("PaymentService", {
  useFactory: (c) =>
    paymentService(
      c.resolve<IPaymentRepository>("PaymentRepository"),
      c.resolve<IOrderRepository>("OrderRepository")
    ),
});

container.register<IPostService>("PostService", {
  useFactory: (c) =>
    postService(
      c.resolve<IPostRepository>("PostRepository"),
      c.resolve<IUserRepository>("UserRepository")
    ),
});

container.register<IReviewService>("ReviewService", {
  useFactory: (c) =>
    reviewService(
      c.resolve<IReviewRepository>("ReviewRepository"),
      c.resolve<IUserRepository>("UserRepository")
    ),
});

container.register<ISellerService>("SellerService", {
  useFactory: (c) =>
    sellerService(
      c.resolve<ISellerRepository>("SellerRepository"),
      c.resolve<IUserRepository>("UserRepository"),
      c.resolve<IReviewRepository>("ReviewRepository")
    ),
});

container.register<ITestDriveService>("TestDriveService", {
  useFactory: (c) =>
    testDriveService(
      c.resolve<ITestDriveRepository>("TestDriveRepository"),
      c.resolve<ISellerRepository>("SellerRepository"),
      c.resolve<IEvRepository>("EvRepository")
    ),
});

// ============================================================================
// CONTROLLERS
// ============================================================================
container.register<IUserController>("UserController", {
  useFactory: (c) => userController(c.resolve<IUserService>("UserService")),
});

container.register<ICartController>("CartController", {
  useFactory: (c) => cartController(c.resolve<ICartService>("CartService")),
});

container.register<IChatbotController>("ChatbotController", {
  useFactory: (c) => chatbotController(c.resolve<IChatbotService>("ChatbotService")),
});

container.register<IEvController>("EvController", {
  useFactory: (c) => evController(c.resolve<IEvService>("EvService")),
});

container.register<IFinancialController>("FinancialController", {
  useFactory: (c) => financialController(c.resolve<IFinancialService>("FinancialService")),
});

container.register<IMaintenanceRecordController>("MaintenanceRecordController", {
  useFactory: (c) =>
    maintenanceRecordController(c.resolve<IMaintenanceRecordService>("MaintenanceRecordService")),
});

container.register<INotificationController>("NotificationController", {
  useFactory: (c) => notificationController(c.resolve<INotificationService>("NotificationService")),
});

container.register<IOrderController>("OrderController", {
  useFactory: (c) => orderController(c.resolve<IOrderService>("OrderService")),
});

container.register<IPaymentController>("PaymentController", {
  useFactory: (c) => paymentController(c.resolve<IPaymentService>("PaymentService")),
});

container.register<IPostController>("PostController", {
  useFactory: (c) => postController(c.resolve<IPostService>("PostService")),
});

container.register<IReviewController>("ReviewController", {
  useFactory: (c) => reviewController(c.resolve<IReviewService>("ReviewService")),
});

container.register<ISellerController>("SellerController", {
  useFactory: (c) => sellerController(c.resolve<ISellerService>("SellerService")),
});

container.register<ITestDriveController>("TestDriveController", {
  useFactory: (c) => testDriveController(c.resolve<ITestDriveService>("TestDriveService")),
});

export { container };