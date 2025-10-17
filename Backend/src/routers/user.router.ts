import { validateDto } from "../middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IUserController } from "../controllers/user.controller";
import { UserDTO } from "../dtos/user.DTO";
import { container } from "../di/user.di";
import { upload } from "../utils/imageHandel";

/**
 * Factory function that creates and configures the router for user-related endpoints.
 * It resolves the user controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for user management.
 */
export const userRouter = (): Router => {
  const router = Router();
  // Resolve the user controller from the DI container.
  const userController = container.resolve<IUserController>("UserController");

  /**
   * @route GET /api/users/:id
   * @description Retrieves a single user by their unique ID.
   * @access Public (or Private, depending on application rules)
   */
  router.get("/:id", (req, res) => userController.getUserByID(req, res));

  /**
   * @route GET /api/users/
   * @description Retrieves a list of all users.
   * @access Private (Typically restricted to Admins)
   */
  router.get("/", (req, res) => userController.findAllUsers(req, res));

  /**
   * @route PUT /api/users/:id
   * @description Updates a user's profile information. Can also handle a profile image upload.
   * @middleware upload.single("profile_image") - Handles a single file upload with the field name 'profile_image'.
   * @middleware validateDto(UserDTO) - Validates the request body against the UserDTO.
   * @access Private (User can update their own profile, or Admin can update any)
   */
  router.put(
    "/:id",
    upload.single("profile_image"),
    validateDto(UserDTO),
    (req, res) => userController.updateUser(req, res)
  );

  /**
   * @route DELETE /api/users/:id
   * @description Deletes a user by their unique ID.
   * @access Private (Typically restricted to Admins)
   */
  router.delete("/:id", (req, res) => userController.deleteUser(req, res));

  return router;
};
