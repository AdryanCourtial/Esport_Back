import { Router } from 'express';

import { createGame, getGame } from '../controllers/gameController';
import { registerForGame } from '../controllers/gameRegistration';


const gameRouter = Router();

gameRouter.post('/createGame', createGame)

gameRouter.get('/', getGame)

gameRouter.post('/register', registerForGame)


export default gameRouter;