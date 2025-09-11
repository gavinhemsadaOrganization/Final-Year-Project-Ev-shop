import { IUser, User } from "../models/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[] | null>;
  save(data: Partial<IUser>): Promise<IUser>;
  update(data: IUser): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export const UserRepository: IUserRepository = {
  findByEmail: async (email) => {
    return await User.findOne({ email }).select("-password");
  },

  findById: async (id) => {
    return await User.findOne({ id  }).select("-password");
  },
  findAll: async() => {
    return await User.find().select("-password");
  },
  save: async (data) => {
    return await User.create(data);
  },
  update: async (data) => {
    return await data.save();
  },
  delete: async (id) => {
    const deleted = await User.findByIdAndDelete(id);
    return deleted !== null;
  },
};
