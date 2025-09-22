import { validateDto } from "../middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IUserController } from "../controllers/user.controller";
import { UserDTO } from "../dtos/user.DTO";
import { container } from "../di/user.di";
import { upload } from "../utils/imageHandel";

export const userRouter = (): Router => {
  const router = Router();
  const userController = container.resolve<IUserController>("UserController");

  router.get("/:id", (req, res) => userController.getUserByID(req, res));
  router.get("/", (req, res) => userController.findAllUsers(req, res));
  router.put("/:id", upload.single("profile_image"), validateDto(UserDTO), (req, res) =>
    userController.updateUser(req, res)
  );
  router.delete("/:id", (req, res) => userController.deleteUser(req, res));

  return router;
};
