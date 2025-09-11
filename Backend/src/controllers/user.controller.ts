import { Request, Response } from "express";
import { IUserService } from "../services/user.service";
import { UserDTO } from "../dtos/user.DTO";

export interface IUserController {
  createUser(req: Request, res: Response): Promise<Response>;
  getUserByID(req: Request, res: Response): Promise<Response>;
  updateUser(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
  findAllUsers(req: Request, res: Response): Promise<Response>;
}

export function userController(userService: IUserService): IUserController {
  return {
    createUser: async (req, res) => {
      try {
        const data = <UserDTO>req.body;
        const file = req.file;
        const result = await userService.create(data, file);
        if (!result.success)
          return res.status(400).json({ message: result.error });
        return res
          .status(201)
          .json({ message: "User created", result: result.user });
      } catch (err) {
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    getUserByID: async (req, res) => {
      try {
        const result = await userService.findById(req.params.id);
        if (!result.success)
          return res.status(400).json({ message: result.error });
        return res.status(200).json({ message: "User", result: result.user });
      } catch (err) {
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    updateUser: async (req, res) => {
      try {
        const data = <UserDTO>req.body;
        const id = req.params.id;
        const file = req.file;
        const result = await userService.update(id,data,file);
        if(!result.success) res.status(400).json({ message: result.error });
        return res.status(200).json({ message: "User updated", user: result.user });
      } catch (err) {
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    deleteUser: async (req, res) => {
      try {
        const id = req.params.id;
        const result = await userService.delete(id);
        if(!result.success) res.status(400).json({ message: result.error });
        return res.status(200).json({ message: "User deleted" });
      } catch (err) {
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
    findAllUsers: async (req, res) => {
      try {
        const result = await userService.findAll();
        if (!result.success)
          return res.status(400).json({ message: result.error });
        return res
          .status(200)
          .json({ message: "All Users", result: result.users });
      } catch (err) {
        return res.status(500).json({ error: err || "Internal server error" });
      }
    },
  };
}
