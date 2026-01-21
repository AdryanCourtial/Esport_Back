import { Router } from "express";
import tournamentRouter from "./tournamentRoutes";
import authRoutes from "./authRoutes";
import userRouter from "./userRoutes";

const router = Router();

router.use("/tournament", tournamentRouter);

router.use("/auth", authRoutes);

router.use("/user", userRouter);

export default router;
