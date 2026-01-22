import { Router } from "express";
import tournamentRouter from "./tournamentRoutes";
import authRoutes from "./authRoutes";
import userRouter from "./userRoutes";
import teamsRoutes from "./teamsRoutes";

const router = Router();

router.use("/tournament", tournamentRouter);

router.use("/auth", authRoutes);

router.use("/user", userRouter);

router.use("/teams", teamsRoutes);

export default router;
