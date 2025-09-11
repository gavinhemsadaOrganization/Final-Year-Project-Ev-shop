import { IUserRepository } from "../repositories/user.repository";
import { UserDTO } from "../dtos/user.DTO";
import { addImage, deleteImage } from "../utils/imageHandel";

export interface IUserService {
  create(
    data: UserDTO,
    file?: Express.Multer.File
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  findById(
    id: string
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  update(
    id: string,
    data: Partial<UserDTO>,
    file?: Express.Multer.File
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  delete(id: string): Promise<{ success: boolean; error?: string }>;
  findAll(): Promise<{ success: boolean; users?: any[]; error?: string }>;
}

export function userService(userRepo: IUserRepository): IUserService {
  const folderName = "UserProfile";
  return {
    create: async (data, file) => {
      try {
        let imageurl = "";
        if (file) {
          imageurl = addImage(file, folderName);
          if (!imageurl)
            return { success: false, error: "Failed image upload" };
        }
        const userData = {
          ...data,
          profile_image: imageurl,
        };
        const user = await userRepo.save(userData);
        return { success: true, user };
      } catch (err) {
        return { success: false, error: "Failed to create user" };
      }
    },

    findById: async (id) => {
      try {
        const user = await userRepo.findById(id);
        if (!user) return { success: false, error: "User not found" };
        return { success: true, user };
      } catch (err) {
        return { success: false, error: "Failed to fetch user" };
      }
    },

    update: async (id, data, file) => {
      try {
        const existingUser = await userRepo.findById(id);
        if (!existingUser) return { success: false, error: "User not found" };
        if (file) {
          if (existingUser.profile_image) {
            deleteImage(existingUser.profile_image);
          }
          const imagePath = addImage(file, folderName);
          existingUser.profile_image = imagePath;
        }
        Object.assign(existingUser, data);
        const user = await userRepo.update(existingUser);
        if (!user) return { success: false, error: "User not found" };
        return { success: true, user };
      } catch (err) {
        return { success: false, error: "Failed to update user" };
      }
    },

    delete: async (id) => {
      try {
        const user = await userRepo.findById(id);
        if (!user) return { success: false, error: "User not found" };
        if (user.profile_image) deleteImage(user.profile_image);
        await userRepo.delete(id);
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete user" };
      }
    },

    findAll: async () => {
      try {
        const users = await userRepo.findAll();
        return { success: true, users: users ?? [] };
      } catch (err) {
        return { success: false, error: "Failed to fetch users" };
      }
    },
  };
}
