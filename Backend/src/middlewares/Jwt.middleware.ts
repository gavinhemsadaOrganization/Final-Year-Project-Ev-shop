import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

declare global {
  namespace Express {
    interface Request {
      User?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const protectJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.session.jwt;

    if (!token) {
      logger.warn("Access token required");
      return res.status(401).json({ error: "Access token required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn("Access token expired");
      // Try to refresh the token
      return refreshToken(req, res, next);
    }

    logger.error(`Error verifying token: ${(error as any).message}`);
    return res.status(403).json({ error: "Invalid token" });
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.session.refreshToken;

    if (!refreshToken) {
      logger.warn("Refresh token required");
      return res.status(401).json({ error: "Please login again" });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as any;

    if (!req.session.userId) {
      logger.warn("User session not found");
      return res.status(401).json({ error: "User session not found" });
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      {
        userId: req.session.userId,
        role: req.session.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    // Update session with new token
    req.session.jwt = newAccessToken;
    req.user = {
      userId: req.session.userId,
      role: req.session.role!,
    };

    next();
  } catch (error) {
    logger.error(`Error refreshing token: ${(error as any).message}`);
    req.session.destroy((err) => {
      return res.status(401).json({ error: "Please login again" });
    });
  }
};
