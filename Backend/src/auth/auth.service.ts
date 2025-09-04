import { IAuthRepository } from "./auth.repository";
import { RegisterDto, LoginDTO } from "./auth.dto";

export interface IAuthService {
  register(data: RegisterDto): Promise<any>;
  login(data: LoginDTO): Promise<any>;
}

export function authService(authRepo: IAuthRepository): IAuthService {
  return {
    register: async (data: RegisterDto) => {
      const { email, password, role } = data;
      const existingUser = await authRepo.findByEmail(email);
      if (existingUser) {
        return null;
      }
      const newUser = await authRepo.save(email, password, role);
      return newUser;
    },
    login: async (data: LoginDTO) => {
      const { email, password } = data;
      const user = await authRepo.findUser(email, password);
      if (!user) {
        return null;
      }
      return user;
    },
  };
}
