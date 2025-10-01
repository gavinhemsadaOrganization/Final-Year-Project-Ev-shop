import { Request, Response } from "express";
import { IUserService } from "../services/user.service";
import { UserDTO } from "../dtos/user.DTO";
import { handleResult, handleError } from "../utils/Respons.util";

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
          return handleResult(res, result, 400);
        }
        return handleResult(res, result, 200);
      } catch (err) {
        return handleError(res, err, "Error getting user by ID");
      }
    },
    updateUser: async (req, res) => {
      try {
        const data = <UserDTO>req.body;
        const id = req.params.id;
        const file = req.file;
        const result = await userService.update(id, data, file);
        if (!result.success) {
          return handleResult(res, result, 400);
        }
        return handleResult(
          res,
          result,
          200
        );
      } catch (err) {
        return handleError(res, err, "Error updating user");
      }
    },
    deleteUser: async (req, res) => {
      try {
        const id = req.params.id;
        const result = await userService.delete(id);
        if (!result.success) {
          return handleResult(res, result, 400);
        }
        return handleResult(res, result, 200);
      } catch (err) {
        return handleError(res, err, "Error deleting user");
      }
    },
    findAllUsers: async (_req, res) => {
      try {
        const result = await userService.findAll();
        if (!result.success) {
          return handleResult(res, result, 400);
        }
        return handleResult(
          res,
          result,
          200
        );
      } catch (err) {
        return handleError(res, err, "Error getting all users");
      }
    },
  };
}
