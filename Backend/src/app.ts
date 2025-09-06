import express from "express";
import type { Application } from "express";
import cors from "cors";

import helmet from "helmet";
import bodyParser from "body-parser";
import { authRouter } from "./auth/auth.router";
import { passport } from "./auth/passport";
import session from "express-session";
import "./auth/passport";

const app: Application = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true,
}));
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter());

export default app;
