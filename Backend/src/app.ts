// Import necessary modules and libraries
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";

// Oauth related imports
import { initializePassport } from "./modules/auth/passport";
import "./modules/auth/passport";

// Session management imports
import connectMongo from "connect-mongo";
import session from "express-session";

// File system and path manipulation imports
import fs from "fs";
import path from "path";

// JWT middleware for authentication
import { protectJWT } from "./shared/middlewares/Jwt.middleware";

// Import all defined API routers
import { authRouter } from "./modules/auth/auth.router";
import { userRouter } from "./modules/user/user.router";
import { notificationRouter } from "./modules/notification/notification.router";
import { chatbotRouter } from "./modules/chatbot/chatbot.router";
import { postRouter } from "./modules/post/post.router";
import { reviewRouter } from "./modules/review/review.router";
import { testDriveRouter } from "./modules/testDrive/testDrive.router";
import { cartRouter } from "./modules/cart/cart.router";
import { financialRouter } from "./modules/financial/financial.router";
import { sellerRouter } from "./modules/seller/seller.router";
import { maintenanceRecordRouter } from "./modules/maintenance_record/maintenanceRecord.router";
import { orderRouter } from "./modules/order/order.router";
import { paymentRouter } from "./modules/payment/payment.router";
import { evRouter } from "./modules/ev/ev.router";

// Logging utilities
import morgan from "morgan";
import logger from "./shared/utils/logger";

// Monitoring initialization function
import { initializeMonitoring } from "./monitoring";

// Initialize the Express application
const app: Express = express();

// Configure CORS (Cross-Origin Resource Sharing)
// Allows requests from specified origins (frontend applications)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5173",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session store in MongoDB
app.use(
  session({
    store: connectMongo.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // 24 hours
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Configure Morgan to stream HTTP request logs to Winston logger
const stream: morgan.StreamOptions = {
  // Use the 'http' level from our custom logger for HTTP request logs
  write: (message) => logger.http(message.trim()),
};

// Initialize Morgan middleware
// Uses 'combined' format for detailed logs in production, 'dev' for simpler logs in development
const morganMiddleware = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev",
  { stream }
);
app.use(morganMiddleware);

// Serve static files from the "public" directory (e.g., frontend assets)
app.use(express.static("public"));

// Initialize Passport.js for authentication
const passport = initializePassport();
// Enable Passport.js middleware
app.use(passport.initialize());
// Enable Passport.js session support (for persistent login sessions)
app.use(passport.session());

// --- RATE LIMITING CONFIGURATION ---

// General API rate limiter
// This protects your API endpoints from brute-force attacks and abuse.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Payment-specific rate limiter for sensitive endpoints
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 payment requests per minute
  message: "Too many payment requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Create an Express Router for API version 1
const apiV1Router = express.Router();
// Apply the general API rate limiter to all routes within apiV1Router
apiV1Router.use(apiLimiter);

// Define API routes and apply JWT protection where necessary
apiV1Router.use("/auth", authRouter());
apiV1Router.use("/user", protectJWT, userRouter());
apiV1Router.use("/notification", protectJWT, notificationRouter());
apiV1Router.use("/chatbot", protectJWT, chatbotRouter());
apiV1Router.use("/post", protectJWT, postRouter());
apiV1Router.use("/review", protectJWT, reviewRouter());
apiV1Router.use("/test-drive", protectJWT, testDriveRouter());
apiV1Router.use("/cart", protectJWT, cartRouter());
apiV1Router.use("/financial", protectJWT, financialRouter());
apiV1Router.use("/seller", protectJWT, sellerRouter());
apiV1Router.use("/maintenance", protectJWT, maintenanceRecordRouter());
apiV1Router.use("/order", protectJWT, orderRouter());
apiV1Router.use("/payment", paymentLimiter, protectJWT, paymentRouter());
apiV1Router.use("/ev", protectJWT, evRouter());

// ============================================
// MONITORING & HEALTH CHECK ENDPOINTS
// ============================================
// Initialize monitoring BEFORE your API routes
// This sets up all monitoring endpoints automatically:
//
// Health & Readiness Checks:
//   GET /health            - Overall application health status (database, memory)
//   GET /ready             - Readiness probe (is app ready to receive traffic?)
//   GET /live              - Liveness probe (is process alive?)
//
// Performance & Metrics:
//   GET /metrics           - Performance metrics (requests, errors, response times, system resources)
//   GET /status            - Application info (version, environment, uptime, Node version)
//
// Detailed Health Checks:
//   GET /health/database   - Detailed database health (connection pool, response time)
//   GET /health/sessions   - Session store health (active sessions count)
//
// System Resources:
//   GET /system            - System resources (memory, CPU usage, process info)
//
// Note: These endpoints are NOT rate-limited and do NOT require authentication
// ============================================

initializeMonitoring(app);

// Mount the API version 1 router under the "/api/v1" path
app.use("/api/v1", apiV1Router);

// Serve images from the uploads directory
// app.use("/images/public", express.static(path.join(process.cwd(), "uploads/public")));
app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "uploads", filename);
  // Construct the full path to the image file

  // Check if the file exists at the specified path
  if (fs.existsSync(filepath)) {
    // If it exists, send the file as a response
    res.sendFile(filepath);
  } else {
    // If not found, send a 404 Not Found response
    res.status(404).json({ error: "Image not found" });
  }
});

// Global Error Handling Middleware
// This middleware catches any errors that occur during request processing
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(err.stack); // Log the error stack trace for debugging
    // Send a generic 500 Internal Server Error response to the client
    res.status(500).json({ message: "Something went wrong!" });
  }
);

// Export the configured Express app instance
export default app;
