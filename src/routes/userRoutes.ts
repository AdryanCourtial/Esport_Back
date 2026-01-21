import { Router } from "express";
import { isAuth } from "../middlewares/isAuth";
import { getUserInfo } from "../controllers/authController";
import { canViewUserProfile } from "../middlewares/canViewUserProfile";

const userRouter = Router();

userRouter.get('/info', isAuth, getUserInfo);

export default userRouter;