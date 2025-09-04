import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser";
import { authRouter } from "./auth/auth.router";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public"));

app.use("/auth", authRouter());

export default app;
