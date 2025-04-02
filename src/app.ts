import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes";
import gameRouter from "./routes/tournamentRoutes";
import { sessionUserType } from "./types/sessionUser.type";
import { DiscordUserInfo } from "./types/discordUserInfo.type";
import tournamentRouter from "./routes/tournamentRoutes";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}
  
const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));



declare module "express-session" {
  interface SessionData {
    user: sessionUserType;
  }
}

app.use(express.json());

app.use(session({
  secret: 'MonSecretMdp', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 5184000000 },
}));


app.use("/auth", authRoutes);

app.use("/tournament", tournamentRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});