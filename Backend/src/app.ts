import express from "express";
import type { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
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
import morgan from "morgan";
import logger from "./utils/logger";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
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

// Routes
app.use("/auth", authRouter());
app.use("/user", protectJWT, userRouter());
app.use("/notification", protectJWT, notificationRouter());
app.use("/chatbot", protectJWT, chatbotRouter());

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
