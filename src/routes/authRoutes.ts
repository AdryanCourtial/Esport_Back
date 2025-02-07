import { Router } from 'express';

import { redirectToDiscord, handleCallback, getUserInfo, updateProfile, logout } from '../controllers/authController';


const router = Router();

// Route pour rediriger vers Discord
router.get('/discord', redirectToDiscord);

router.get('/discord/callback', handleCallback);

router.get('/userinfo', getUserInfo);

router.post('/update-profile', updateProfile);


router.post('/logout', logout);



export default router;