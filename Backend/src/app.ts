import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import rateLimit from 'express-rate-limit';
// Oauth
import { initializePassport } from "./auth/passport";
import "./auth/passport";
// Session
import connectMongo from "connect-mongo";
import session from "express-session";
// file system
import fs from "fs";
import path from "path";
// JWT
import { protectJWT } from "./middlewares/Jwt.middleware";
// routers
import { authRouter } from "./auth/auth.router";
import { userRouter } from "./routers/user.router";
import { notificationRouter } from "./routers/notification.router";
import { chatbotRouter } from "./routers/chatbot.router";
import { postRouter } from "./routers/post.router";
import { reviewRouter } from "./routers/review.router";
import { testDriveRouter } from "./routers/testDrive.router";
import { cartRouter } from "./routers/cart.router";
import { financialRouter } from "./routers/financial.router";
import { sellerRouter } from "./routers/seller.router";
import { maintenanceRecordRouter } from "./routers/maintenanceRecord.router";
import { orderRouter } from "./routers/order.router";
import { paymentRouter } from "./routers/payment.router";
import { evRouter } from "./routers/ev.router";

// logging 
import morgan from "morgan";
import logger from "./utils/logger";

const app: Express = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500", "http://localhost:5173", "http://localhost:5000"],
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

// Morgan -> Winston Stream - handle http logging
const stream: morgan.StreamOptions = {
  // Use the http level from our logger
  write: (message) => logger.http(message.trim()),
};

// Use morgan middleware with our stream
// Use 'combined' format for production for more details, 'dev' for development
const morganMiddleware = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev",
  { stream }
);
app.use(morganMiddleware);

// Serve static files from the "public" directory
app.use(express.static("public"));

// Initialize Passport and restore authentication state, if any, from the session.
const passport = initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// --- 2. SETUP RATE LIMITING ---
// This protects your API endpoints from brute-force attacks and abuse.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
});

// Payment-specific rate limiting
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 payment requests per minute
  message: 'Too many payment requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

const apiV1Router = express.Router();
apiV1Router.use(apiLimiter);
// Routes
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
apiV1Router.use("/payment",paymentLimiter, protectJWT, paymentRouter());
apiV1Router.use("/ev", protectJWT, evRouter());

app.use("/api/v1", apiV1Router);

// Serve images from the uploads directory
// app.use("/images/public", express.static(path.join(process.cwd(), "uploads/public")));
app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "uploads", filename);

  // Check if file exists
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
});

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

export default app;
