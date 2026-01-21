import { Router } from 'express';

import { addResultToTournament  , createTournament, getAdminTournament, getTournament, seeDetailTournament } from '../controllers/tournamentController';
import { checkRegistration, registerForTournament, unregisterForGame } from '../controllers/tournamentRegistration';
import { isAdmin } from '../middlewares/isAdminMiddleware';
import { isAuth } from '../middlewares/isAuth';


const tournamentRouter = Router();

tournamentRouter.post('/createTournament', isAdmin, createTournament);

tournamentRouter.get('/adminTournament', isAdmin, getAdminTournament);

tournamentRouter.get('/:id', seeDetailTournament); 

tournamentRouter.post('/:id/addResult', isAdmin, addResultToTournament);

tournamentRouter.get('/', getTournament)

tournamentRouter.post('/checkRegistration', isAuth, checkRegistration)

tournamentRouter.post('/unregister', isAuth, unregisterForGame)

tournamentRouter.post('/register', isAuth, registerForTournament)


export default tournamentRouter;