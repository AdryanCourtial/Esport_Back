import { Router } from 'express';

import { redirectToDiscord, handleCallback, getUserInfo, updateProfile, logout, reconnectUser, getSectors } from '../controllers/authController';


const router = Router();

// Route pour rediriger vers Discord
router.get('/discord', redirectToDiscord);

router.get('/discord/callback', handleCallback);

router.get('/userinfo', getUserInfo);

router.get('/sectors', getSectors)

router.post('/update-profile', updateProfile);

router.post('/logout', logout);

router.get('/reconnect', reconnectUser)

export default router;