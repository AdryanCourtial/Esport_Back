import { Router } from 'express';

import { addResultToTournament  , createTournament, getAdminTournament, getTournament, seeDetailTournament } from '../controllers/tournamentController';
import { checkRegistration, registerForTournament, unregisterForGame } from '../controllers/tournamentRegistration';
import { isAdmin } from '../middlewares/isAdminMiddleware';


const tournamentRouter = Router();

tournamentRouter.post('/createTournament', isAdmin, createTournament);

tournamentRouter.get('/adminTournament', isAdmin, getAdminTournament);

tournamentRouter.get('/:id', seeDetailTournament); 

tournamentRouter.post('/:id/addResult', isAdmin, addResultToTournament);

tournamentRouter.get('/', getTournament)

tournamentRouter.post('/checkRegistration', checkRegistration)

tournamentRouter.post('/unregister', unregisterForGame)

tournamentRouter.post('/register', registerForTournament)


export default tournamentRouter;