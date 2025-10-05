import { IUser, User } from "../models/User";
import { withErrorHandling } from "../utils/CustomException";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[] | null>;
  update(data: IUser): Promise<IUser | null>;
  delete(id: string): Promise<boolean | null>;
}

export const UserRepository: IUserRepository = {
  findByEmail: withErrorHandling(async (email) => {
    return await User.findOne({ email }).select("-password");
  }),
  findById: withErrorHandling(async (_id) => {
    return await User.findOne({ _id  }).select("-password");
  }),
  findAll: withErrorHandling(async() => {
    return await User.find().select("-password");
  }),
  update: withErrorHandling(async (data) => {
    return await data.save();
  }),
  delete: withErrorHandling(async (id) => {
    const deleted = await User.findByIdAndDelete(id);
    return deleted !== null;
  }),
};
