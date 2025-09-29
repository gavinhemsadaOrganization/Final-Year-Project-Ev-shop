import { Request, Response } from "express";
import { IUserService } from "../services/user.service";
import { UserDTO } from "../dtos/user.DTO";
import logger from "../utils/logger";

export interface IUserController {
  getUserByID(req: Request, res: Response): Promise<Response>;
  updateUser(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
  findAllUsers(req: Request, res: Response): Promise<Response>;
}

export function userController(userService: IUserService): IUserController {
  return {
    getUserByID: async (req, res) => {
      try {
        const result = await userService.findById(req.params.id);
        if (!result.success) {
          logger.error(`Error getting user by ID: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`User found: ${result.user}`);
        return res.status(200).json({ message: "User", result: result.user });
      } catch (err) {
        logger.error(`Error getting user by ID: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    updateUser: async (req, res) => {
      try {
        const data = <UserDTO>req.body;
        const id = req.params.id;
        const file = req.file;
        const result = await userService.update(id, data, file);
        if (!result.success) {
          logger.error(`Error updating user: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`User updated: ${result.user}`);
        return res
          .status(200)
          .json({ message: "User updated", user: result.user });
      } catch (err) {
        logger.error(`Error updating user: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    deleteUser: async (req, res) => {
      try {
        const id = req.params.id;
        const result = await userService.delete(id);
        if (!result.success) {
          logger.error(`Error deleting user: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`User deleted: ${id}`);
        return res.status(200).json({ message: "User deleted" });
      } catch (err) {
        logger.error(`Error deleting user: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    findAllUsers: async (_req, res) => {
      try {
        const result = await userService.findAll();
        if (!result.success) {
          logger.error(`Error getting all users: ${result.error}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Successfully retrieved all users`);
        return res
          .status(200)
          .json({ message: "All Users", result: result.users });
      } catch (err) {
        logger.error(`Error getting all users: ${err}`);
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
  };
}
