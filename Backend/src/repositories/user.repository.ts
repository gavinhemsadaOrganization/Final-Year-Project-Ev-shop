import { IUser, User } from "../models/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[] | null>;
  update(data: IUser): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export const UserRepository: IUserRepository = {
  findByEmail: async (email) => {
    return await User.findOne({ email }).select("-password");
  },

  findById: async (_id) => {
    return await User.findOne({ _id  }).select("-password");
  },
  findAll: async() => {
    return await User.find().select("-password");
  },
  update: async (data) => {
    return await data.save();
  },
  delete: async (id) => {
    const deleted = await User.findByIdAndDelete(id);
    return deleted !== null;
  },
};
