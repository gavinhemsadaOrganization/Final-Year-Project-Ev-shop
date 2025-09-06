import { IAuthRepository } from "./auth.repository";
import { RegisterDto, LoginDTO } from "./auth.dto";

export interface IAuthService {
  register(
    data: RegisterDto
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  login(
    data: LoginDTO
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  oauthLogin(
    email: string,
    name: string
  ): Promise<{ success: boolean; user?: any; error?: string; checkpass?: boolean }>;
}

export function authService(authRepo: IAuthRepository): IAuthService {
  return {
    register: async (data: RegisterDto) => {
      try {
        const { email, password } = data;
        const existingUser = await authRepo.findByEmail(email);
        if (existingUser) {
          return { success: false, error: "User already exists" };
        }
        const newUser = await authRepo.save(email, password);
        return { success: true, user: newUser };
      } catch (err) {
        return { success: false, error: "Registration failed" };
      }
    },
    login: async (data: LoginDTO) => {
      try {
        const { email, password } = data;
        const user = await authRepo.findUser(email, password);
        if (!user) {
          return { success: false, error: "Invalid credentials" };
        }
        return { success: true, user };
      } catch (err) {
        return { success: false, error: "Login failed" };
      }
    },
    oauthLogin: async (email: string, name: string) => {
      try {
        const user = authRepo.findOrCreate(email, name);
        const checkpass = await authRepo.checkPassword(email);
        return { success: true, user, checkpass };
      } catch (err) {
        return { success: false, error: "OAuth login failed" };
      }
    },
  };
}
