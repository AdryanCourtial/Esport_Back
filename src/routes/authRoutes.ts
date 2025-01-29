import { Router } from 'express';

import { redirectToDiscord, handleCallback, getUserInfo, updateProfile, logout } from '../controllers/authController';
import { createGame } from '../controllers/gameController';


const router = Router();

// Route pour rediriger vers Discord
router.get('/discord', redirectToDiscord);

router.get('/discord/callback', handleCallback);

router.get('/userinfo', getUserInfo);

router.post('/update-profile', updateProfile);

router.post('/game/createGame', createGame)


router.post('/logout', logout);



export default router;