import { IAuthRepository } from "./auth.repository";
import { RegisterDto, LoginDTO } from "./auth.dto";
import { OAuth2Client } from "google-auth-library";

export interface IAuthService {
  register(
    data: RegisterDto
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  login(
    data: LoginDTO
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  googleLogin(
    token: any
  ): Promise<{ success: boolean; user?: any; error?: string }>;
  facebookLogin(
    token: any
  ): Promise<{ success: boolean; user?: any; error?: string }>;
}

export function authService(authRepo: IAuthRepository): IAuthService {
  const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

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
    googleLogin: async (token: any) => {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email!;
        const name = payload?.name!;
        const user = authRepo.findOrCreate(email, name);
        const checkpass = await authRepo.checkPassword(email);
        return { success: true, user, checkpass };
      } catch (err) {
        return { success: false, error: "Google login failed" };
      }
    },
    facebookLogin: async (token: any) => {
      try {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`
        );
        const data = await response.json();
        const email = data?.email!;
        const name = data?.name!;
        const user = await authRepo.findOrCreate(email, name);
        const checkpass = await authRepo.checkPassword(email);
        return { success: true, user, checkpass };
      } catch (err) {
        return { success: false, error: "Facebook login failed" };
      }
    },
  };
}
