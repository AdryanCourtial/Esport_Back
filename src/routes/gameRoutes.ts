import { Router } from 'express';

import { createGame, getGame } from '../controllers/gameController';
import { registerForGame } from '../controllers/gameRegistration';
import { isAdmin } from '../middlewares/isAdminMiddleware';


const gameRouter = Router();

gameRouter.post('/createGame', isAdmin, createGame);

gameRouter.get('/', getGame)

gameRouter.post('/register', registerForGame)


export default gameRouter;