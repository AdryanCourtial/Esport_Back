import { Request, Response, NextFunction } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {

  if (!req.session.user) {
    res.status(401).json({ message: "Utilisateur non authentifié. Veuillez vous connecter." });
    return;
  }

  next();
}; 