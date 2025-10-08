import { IUser, User } from "../models/User";
import { withErrorHandling } from "../utils/CustomException";

export interface IAuthRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(email: string, password: string): Promise<IUser | null>;
  findUser(email: string, password: string): Promise<IUser | null>;
  findOrCreate(email: string, name: string): Promise<IUser | null>;
  checkPassword(email: string): Promise<boolean | null>;
  updateLastLogin(userId: string, lastLogin: Date): Promise<void | null>;
}

export const AuthRepository: IAuthRepository = {
  findByEmail: withErrorHandling(async (email: string) => {
    const user = await User.findOne({ email }).select("-password");
    return user;
  }),
  save: withErrorHandling(async (email: string, password: string) => {
    const newUser = await User.create({ email, password });
    return newUser;
  }),
  findUser: withErrorHandling(async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) return null;
    const isMatch = await user?.comparePassword(password);
    if (!isMatch) return null;
    return user;
  }),
  findOrCreate: withErrorHandling(async (email, name) => {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }
    return user;
  }),
  checkPassword: withErrorHandling(async (email) => {
    const user = await User.findOne({ email });
    if (!user || !user.password) return false;
    return true;
  }),
  updateLastLogin: withErrorHandling(async (userId: string, lastLogin: Date) => {
    await User.findByIdAndUpdate(userId, { last_login: lastLogin });
  }),
};
