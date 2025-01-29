import { Request, Response } from 'express';
import { prisma } from "../../lib/prisma";
import axios from 'axios';
import config from '../../config.json';
import { DiscordUserInfo } from '../types/discordUserInfo.type';


let currentUser: DiscordUserInfo | null = null;  

export const getUserInfo = (req: Request, res: Response): void => {
  if (currentUser) {
    console.log("Informations utilisateur trouvées :", currentUser);
    res.json(currentUser);
  } else {
    console.log("Utilisateur non connecté");
    res.status(401).send('Utilisateur non connecté');
  }
};

export const redirectToDiscord = (req: Request, res: Response): void => {
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=identify`;
  console.log("Redirection vers Discord avec l'URL :", discordAuthUrl);
  res.redirect(discordAuthUrl);
};

export const handleCallback = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    console.log("Code d'autorisation non trouvé dans la requête de callback");
    res.status(400).send('Code non trouvé.');
    return;
  }

  try {
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, token_type } = tokenResponse.data;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const userInfo: DiscordUserInfo = userResponse.data;
    console.log("Informations utilisateur récupérées :", userInfo);

    currentUser = userInfo; 

    let user = await prisma.user.findUnique({
      where: {
        discordId: userInfo.id,
      },
    });


    if (user) {
      console.log("ID de l'utilisateur dans la base de données : ", user.id);
      
      req.session.user = {
        id: user.id,  
        username: user.username,
      };

      res.redirect('http://localhost:5173'); 
    } else {
      res.redirect('http://localhost:5173/complete-profile');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du token Discord :', error);
    res.status(500).send('Erreur lors de la connexion avec Discord');
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    res.status(400).send('Prénom, nom et email sont requis');
    return;
  }

  try {
    // Utilisation des données stockées dans la session
    const updatedUser = await prisma.user.create({
      data: {
        discordId: currentUser?.id!,
        username: currentUser?.username!,
        discriminator: currentUser?.discriminator!,
        avatar: currentUser?.avatar,
        globalName: currentUser?.global_name,
        accentColor: currentUser?.accent_color,
        bannerColor: currentUser?.banner_color,
        locale: currentUser?.locale!,
        mfaEnabled: currentUser?.mfa_enabled!,
        premiumType: currentUser?.premium_type!,
        publicFlags: currentUser?.public_flags!,
        flags: currentUser?.flags!,
        firstName,   
        lastName,
        email
      },
    });

    req.session.user = {
      id: updatedUser.id, 
      username: updatedUser.username,
    };
    console.log('je suis id du user', req.session.user?.id, req.session.user?.username);


    console.log("Profil utilisateur créé ou mis à jour :", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    res.status(500).send('Erreur lors de la mise à jour du profil');
  }
};


export const logout = (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).send("Erreur lors de la déconnexion");
    }
    
    res.clearCookie('connect.sid'); 
    
    res.status(200).send('Déconnecté avec succès');
  });
};