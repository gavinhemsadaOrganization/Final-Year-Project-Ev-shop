import { IUser, User } from "../models/User";

export interface IAuthRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(email: string, password: string): Promise<IUser>;
  findUser(email: string, password: string): Promise<IUser | null>;
  findOrCreate(email: string, name: string): Promise<IUser | null>;
  checkPassword(email: string): Promise<boolean>;
  updateLastLogin(userId: string, lastLogin: Date): Promise<void>;
}

export const AuthRepository: IAuthRepository = {
  findByEmail: async (email: string) => {
    const user = await User.findOne({ email }).select("-password");
    return user;
  },
  save: async (email: string, password: string) => {
    const newUser = await User.create({ email, password });
    return newUser;
  },
  findUser: async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) return null;
    const isMatch = user?.comparePassword(password);
    if (!isMatch) return null;
    return user;
  },
  findOrCreate: async (email, name) => {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }
    return user;
  },
  checkPassword: async (email) => {
    const user = await User.findOne({ email });
    if (!user || !user.password) return false;
    return true;
  },
  updateLastLogin: async (userId: string, lastLogin: Date) => {
    await User.findByIdAndUpdate(userId, { last_login: lastLogin });
  },
};
