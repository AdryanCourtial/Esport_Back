import { Request, Response, NextFunction } from 'express';
import { RoleUserEnum } from '../types/RoleUser.enum';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {

  const userRole = RoleUserEnum.ADMIN
  
  console.log(req.session.user?.role)

  if (req.session.user?.role !== userRole) {  
    res.status(404).json({ message: 'Aucune page trouvé :(' });
    return;  
  } 
  next();  
};
