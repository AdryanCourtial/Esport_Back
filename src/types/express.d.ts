import "express";
import { RoleUserEnum } from "./RoleUser.enum";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: RoleUserEnum;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
