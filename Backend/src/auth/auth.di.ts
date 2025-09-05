import { container } from "tsyringe";
import { AuthRepository, IAuthRepository } from "./auth.repository";
import { authService, IAuthService } from "./auth.service";
import { authController, IAuthController } from "./auth.controller";

// Register dependencies
container.register<IAuthRepository>("IAuthRepository", {
  useValue: AuthRepository,
});

container.register<IAuthService>("IAuthService", {
  useFactory: (c) => authService(c.resolve<IAuthRepository>("IAuthRepository")),
});

container.register<IAuthController>("IAuthController", {
  useFactory: (c) => authController(c.resolve<IAuthService>("IAuthService")),
});

export { container };
