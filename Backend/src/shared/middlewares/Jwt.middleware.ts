import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/**
 * Defines the structure of the JWT payload for type safety.
 */
interface JwtPayload {
  userId: string;
  role: string;
}

/**
 * Extends the global Express Request interface to include a `user` property.
 * This allows us to attach the decoded JWT payload to the request object
 * in a type-safe manner.
 */
declare global {
  namespace Express {
    // Augment the existing User interface from Express/Passport
    interface User {
      userId: string;
      role: string;
    }
  }
}

/**
 * Express middleware to protect routes by verifying a JWT.
 * It checks for a JWT in the user's session. If the token is valid, it attaches
 * the user's info to the request object. If the token is expired, it attempts
 * to refresh it using a refresh token.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 */
export const protectJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.session.jwt;

    if (!token) {
      logger.warn("Access denied: No access token provided.");
      return res.status(401).json({ error: "Access token required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Add user info to request
    req.user = decoded as Express.User;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn("Access token expired");
      // If the token is expired, attempt to refresh it.
      return refreshToken(req, res, next);
    }

    logger.error(`Error verifying token: ${(error as any).message}`);
    return res.status(403).json({ error: "Invalid token" });
  }
};

/**
 * Handles the JWT refresh logic.
 * This function is called by `protectJWT` when an access token has expired.
 * It verifies the refresh token from the session, generates a new access token,
 * and updates the session.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 */
const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.session.refreshToken;

    if (!refreshToken) {
      logger.warn("Authentication failed: No refresh token available.");
      return res.status(401).json({ error: "Please login again" });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as JwtPayload;

    if (!req.session.userId) {
      logger.warn("Authentication failed: User session not found for refresh.");
      return res.status(401).json({ error: "User session not found" });
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      {
        userId: req.session.userId,
        role: req.session.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" } // Set the new access token's expiration.
    );

    // Update session with new token
    req.session.jwt = newAccessToken;

    // Attach user info to the request for the current request cycle.
    req.user = decoded as Express.User;

    logger.info(`Token refreshed successfully for user: ${req.session.userId}`);
    next();
  } catch (error) {
    logger.error(`Error refreshing token: ${(error as any).message}`);
    // If refresh fails (e.g., refresh token is also expired or invalid),
    // destroy the session and force the user to log in again.
    req.session.destroy((err) => {
      if (err) {
        logger.error(
          "Failed to destroy session during token refresh failure.",
          err
        );
      }
      return res.status(401).json({ error: "Please login again" });
    });
  }
};
