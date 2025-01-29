import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes";
import gameRouter from "./routes/gameRoutes";

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

app.use(express.json());

app.use(session({
  secret: 'MonSecretMdp', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  }
}));


app.use("/auth", authRoutes);

app.use("/game", gameRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});