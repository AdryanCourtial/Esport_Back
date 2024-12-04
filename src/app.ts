import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend qui fait les requêtes
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


// Routes d'authentification
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
