import { container } from "tsyringe";
import { UserRepository, IUserRepository } from "../repositories/user.repository";
import { userService, IUserService } from "../services/user.service";
import { userController, IUserController } from "../controllers/user.controller";

container.register<IUserRepository>("UserRepository", {
  useValue: UserRepository,
});

container.register<IUserService>("UserService", {
  useFactory: (c) => userService(c.resolve<IUserRepository>("UserRepository")),
});

container.register<IUserController>("UserController", {
  useFactory: (c) => userController(c.resolve<IUserService>("UserService")),
});

export { container };
