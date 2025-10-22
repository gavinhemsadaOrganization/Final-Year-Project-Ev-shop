import session from "express-session";

declare module 'express-session' {
  interface SessionData {
    jwt?: string;
    userId?: string;
    refreshToken?: string;
    role?: string;
  }
}