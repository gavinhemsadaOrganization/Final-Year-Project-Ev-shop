// src/di/container.ts
import { container } from "tsyringe";

// ============================================================================
// REPOSITORY IMPORTS
// ============================================================================
import {
  AuthRepository,
  IAuthRepository,
} from "../modules/auth/auth.repository";
import {
  IUserRepository,
  UserRepository,
} from "../modules/user/user.repository";
import {
  ICartRepository,
  CartRepository,
} from "../modules/cart/cart.repository";
import {
  IChatbotRepository,
  ChatbotRepository,
} from "../modules/chatbot/chatbot.repository";
import { IEvRepository, EvRepository } from "../modules/ev/ev.repository";
import {
  IFinancialRepository,
  FinancialRepository,
} from "../modules/financial/financial.repository";
import {
  IMaintenanceRecordRepository,
  MaintenanceRecordRepository,
} from "../modules/maintenanceRecord/maintenanceRecord.repository";
import {
  INotificationRepository,
  NotificationRepository,
} from "../modules/notification/notification.repository";
import {
  IOrderRepository,
  OrderRepository,
} from "../modules/order/order.repository";
import {
  IPaymentRepository,
  PaymentRepository,
} from "../modules/payment/payment.repository";
import {
  IPostRepository,
  PostRepository,
} from "../modules/post/post.repository";
import {
  IReviewRepository,
  ReviewRepository,
} from "../modules/review/review.repository";
import {
  ISellerRepository,
  SellerRepository,
} from "../modules/seller/seller.repository";
import {
  ITestDriveRepository,
  TestDriveRepository,
} from "../modules/testDrive/testDrive.repository";

// ============================================================================
// SERVICE IMPORTS
// ============================================================================
import { authService, IAuthService } from "../modules/auth/auth.service";
import { IUserService, userService } from "../modules/user/user.service";
import { ICartService, cartService } from "../modules/cart/cart.service";
import {
  IChatbotService,
  chatbotService,
} from "../modules/chatbot/chatbot.service";
import { IEvService, evService } from "../modules/ev/ev.service";
import {
  IFinancialService,
  financialService,
} from "../modules/financial/financial.service";
import {
  IMaintenanceRecordService,
  maintenanceRecordService,
} from "../modules/maintenanceRecord/maintenanceRecord.service";
import {
  INotificationService,
  notificationService,
} from "../modules/notification/notification.service";
import { IOrderService, orderService } from "../modules/order/order.service";
import {
  IPaymentService,
  paymentService,
} from "../modules/payment/payment.service";
import { IPostService, postService } from "../modules/post/post.service";
import {
  IReviewService,
  reviewService,
} from "../modules/review/review.service";
import {
  ISellerService,
  sellerService,
} from "../modules/seller/seller.service";
import {
  ITestDriveService,
  testDriveService,
} from "../modules/testDrive/testDrive.service";

// ============================================================================
// CONTROLLER IMPORTS
// ============================================================================
import {
  authController,
  IAuthController,
} from "../modules/auth/auth.controller";
import {
  IUserController,
  userController,
} from "../modules/user/user.controller";
import {
  ICartController,
  cartController,
} from "../modules/cart/cart.controller";
import {
  IChatbotController,
  chatbotController,
} from "../modules/chatbot/chatbot.controller";
import { IEvController, evController } from "../modules/ev/ev.controller";
import {
  IFinancialController,
  financialController,
} from "../modules/financial/financial.controller";
import {
  IMaintenanceRecordController,
  maintenanceRecordController,
} from "../modules/maintenanceRecord/maintenanceRecord.controller";
import {
  INotificationController,
  notificationController,
} from "../modules/notification/notification.controller";
import {
  IOrderController,
  orderController,
} from "../modules/order/order.controller";
import {
  IPaymentController,
  paymentController,
} from "../modules/payment/payment.controller";
import {
  IPostController,
  postController,
} from "../modules/post/post.controller";
import {
  IReviewController,
  reviewController,
} from "../modules/review/review.controller";
import {
  ISellerController,
  sellerController,
} from "../modules/seller/seller.controller";
import {
  ITestDriveController,
  testDriveController,
} from "../modules/testDrive/testDrive.controller";

/**
 * Central Dependency Injection Container
 *
 * Registers all application dependencies using tsyringe.
 * Organized by layer: Repositories → Services → Controllers
 */

// ============================================================================
// REPOSITORIES
// ============================================================================
container.register<IAuthRepository>("IAuthRepository", {
  useValue: AuthRepository,
});
container.register<IUserRepository>("UserRepository", {
  useValue: UserRepository,
});
container.register<ICartRepository>("CartRepository", {
  useValue: CartRepository,
});
container.register<IChatbotRepository>("ChatbotRepository", {
  useValue: ChatbotRepository,
});
container.register<IEvRepository>("EvRepository", { useValue: EvRepository });
container.register<IFinancialRepository>("FinancialRepository", {
  useValue: FinancialRepository,
});
container.register<IMaintenanceRecordRepository>(
  "MaintenanceRecordRepository",
  { useValue: MaintenanceRecordRepository }
);
container.register<INotificationRepository>("NotificationRepository", {
  useValue: NotificationRepository,
});
container.register<IOrderRepository>("OrderRepository", {
  useValue: OrderRepository,
});
container.register<IPaymentRepository>("PaymentRepository", {
  useValue: PaymentRepository,
});
container.register<IPostRepository>("PostRepository", {
  useValue: PostRepository,
});
container.register<IReviewRepository>("ReviewRepository", {
  useValue: ReviewRepository,
});
container.register<ISellerRepository>("SellerRepository", {
  useValue: SellerRepository,
});
container.register<ITestDriveRepository>("TestDriveRepository", {
  useValue: TestDriveRepository,
});

// ============================================================================
// SERVICES
// ============================================================================
container.register<IAuthService>("IAuthService", {
  useFactory: (c) => authService(c.resolve<IAuthRepository>("IAuthRepository")),
});
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
  useFactory: (c) =>
    orderService(c.resolve<IOrderRepository>("OrderRepository")),
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
container.register<IAuthController>("IAuthController", {
  useFactory: (c) => authController(c.resolve<IAuthService>("IAuthService")),
});
container.register<IUserController>("UserController", {
  useFactory: (c) => userController(c.resolve<IUserService>("UserService")),
});

container.register<ICartController>("CartController", {
  useFactory: (c) => cartController(c.resolve<ICartService>("CartService")),
});

container.register<IChatbotController>("ChatbotController", {
  useFactory: (c) =>
    chatbotController(c.resolve<IChatbotService>("ChatbotService")),
});

container.register<IEvController>("EvController", {
  useFactory: (c) => evController(c.resolve<IEvService>("EvService")),
});

container.register<IFinancialController>("FinancialController", {
  useFactory: (c) =>
    financialController(c.resolve<IFinancialService>("FinancialService")),
});

container.register<IMaintenanceRecordController>(
  "MaintenanceRecordController",
  {
    useFactory: (c) =>
      maintenanceRecordController(
        c.resolve<IMaintenanceRecordService>("MaintenanceRecordService")
      ),
  }
);

container.register<INotificationController>("NotificationController", {
  useFactory: (c) =>
    notificationController(
      c.resolve<INotificationService>("NotificationService")
    ),
});

container.register<IOrderController>("OrderController", {
  useFactory: (c) => orderController(c.resolve<IOrderService>("OrderService")),
});

container.register<IPaymentController>("PaymentController", {
  useFactory: (c) =>
    paymentController(c.resolve<IPaymentService>("PaymentService")),
});

container.register<IPostController>("PostController", {
  useFactory: (c) => postController(c.resolve<IPostService>("PostService")),
});

container.register<IReviewController>("ReviewController", {
  useFactory: (c) =>
    reviewController(c.resolve<IReviewService>("ReviewService")),
});

container.register<ISellerController>("SellerController", {
  useFactory: (c) =>
    sellerController(c.resolve<ISellerService>("SellerService")),
});

container.register<ITestDriveController>("TestDriveController", {
  useFactory: (c) =>
    testDriveController(c.resolve<ITestDriveService>("TestDriveService")),
});

export { container };
