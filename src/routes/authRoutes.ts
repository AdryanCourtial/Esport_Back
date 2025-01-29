import { Router } from 'express';

import { redirectToDiscord, handleCallback, getUserInfo, updateProfile } from '../controllers/authController';
import { createGame } from '../controllers/gameController';


const router = Router();

// Route pour rediriger vers Discord
router.get('/discord', redirectToDiscord);

router.get('/discord/callback', handleCallback);

router.get('/userinfo', getUserInfo);

router.post('/update-profile', updateProfile);

router.post('/game/createGame', createGame)


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).send("Erreur lors de la déconnexion");
    }
    res.clearCookie('connect.sid'); 
    res.send("Déconnecté avec succès");
  });
});



export default router;