import { Request, Response, NextFunction } from 'express';
import { RoleUserEnum } from '../types/RoleUser.enum';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {

  if (!req.session.user) {
    res.status(401).json({ message: 'Utilisateur non authentifié. Veuillez vous connecter.' });
    return;
  }
  const userRole = RoleUserEnum.ADMIN

  if (req.session.user?.role !== userRole) {  
    res.status(404).json({ message: 'Aucune page trouvé :(' });
    return;  
  } 
  next();  
};
