import { Request, Response, NextFunction } from "express";

export const canViewUserProfile = (req: Request, res: Response, next: NextFunction): void => {
  const authUser = req.session.user;
  const requestedId = req.params.id;

  if (!authUser) {
    res.status(401).json({ message: "Unauthorized" });
    return
  }

  if (authUser.role === "ADMIN") {
    return next();
  }

  if (authUser.id === requestedId) {
    return next();
  }

  res.status(403).json({ message: "Forbidden: not allowed to access this profile" });
  return
};
