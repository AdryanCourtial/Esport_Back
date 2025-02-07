import { Router } from 'express';

import { createTournament, getTournament } from '../controllers/tournamentController';
import { checkRegistration, registerForTournament, unregisterForGame } from '../controllers/tournamentRegistration';
import { isAdmin } from '../middlewares/isAdminMiddleware';


const tournamentRouter = Router();

tournamentRouter.post('/createTournament', isAdmin, createTournament);

tournamentRouter.get('/', getTournament)

tournamentRouter.post('/checkRegistration', checkRegistration)

tournamentRouter.post('/unregister', unregisterForGame)

tournamentRouter.post('/register', registerForTournament)


export default tournamentRouter;