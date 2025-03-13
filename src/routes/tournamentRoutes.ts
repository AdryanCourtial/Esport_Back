import { Router } from 'express';

import { addResultToTournament, adminTournament, createTournament, getAdminTournament, getTournament } from '../controllers/tournamentController';
import { checkRegistration, registerForTournament, unregisterForGame } from '../controllers/tournamentRegistration';
import { isAdmin } from '../middlewares/isAdminMiddleware';


const tournamentRouter = Router();

tournamentRouter.post('/createTournament', isAdmin, createTournament);

tournamentRouter.get('/adminTournament', isAdmin, getAdminTournament);

tournamentRouter.get('/:id', isAdmin, adminTournament);

tournamentRouter.post('/:id/addResult', isAdmin, addResultToTournament);

tournamentRouter.get('/', getTournament)

tournamentRouter.post('/checkRegistration', checkRegistration)

tournamentRouter.post('/unregister', unregisterForGame)

tournamentRouter.post('/register', registerForTournament)


export default tournamentRouter;