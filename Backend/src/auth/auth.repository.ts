import { IUser, User } from "../models/User";

export interface IAuthRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(email: string, password: string, role: string): Promise<IUser>;
  findUser(email: string, password: string): Promise<IUser | null>;
}

export const AuthRepository: IAuthRepository = {
  findByEmail: async (email: string) => {
    const user = await User.findOne({ email  }).select("-password");
    return user;
  },
  save: async (email: string, password: string, role: string) => {
    const newUser = await User.create({ email, password, role });
    return newUser;
  },
  findUser: async (email: string, password: string) => {
    const user = await User.findOne({ email  });
    if (!user) return null;
    const isMatch = user?.comparePassword(password);
    if (!isMatch) return null;
    return user;
  },
};
