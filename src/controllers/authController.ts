import { Request, Response } from 'express';
import {prisma} from "../../lib/prisma";
import axios from 'axios';
import config from '../../config.json';

const { clientId, clientSecret, redirectUri } = config;

// Variables pour stocker l'utilisateur pour simplifier (cela devrait être dans une base de données en production)
let currentUser: any = null;

/**
 * Gérer l'obtention des informations utilisateur
 */
export const getUserInfo = (req: Request, res: Response): void => {
  if (currentUser) {
    console.log("Informations utilisateur trouvées :", currentUser);
    res.json(currentUser);
  } else {
    console.log("Utilisateur non connecté");
    res.status(401).send('Utilisateur non connecté');
  }
};

/**
 * Rediriger l'utilisateur vers Discord pour l'authentification
 */
export const redirectToDiscord = (req: Request, res: Response): void => {
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;
  
  console.log("Redirection vers Discord avec l'URL :", discordAuthUrl);
  
  res.redirect(discordAuthUrl);
};

/**
 * Gérer le callback de Discord après l'autorisation de l'utilisateur
 */
export const handleCallback = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    console.log("Code d'autorisation non trouvé dans la requête de callback");
    res.status(400).send('Code non trouvé.');
    return;
  }

  console.log("Code d'autorisation reçu :", code);

  try {
    // Échanger le code d'autorisation contre un token d'accès
    console.log("Envoi de la requête pour échanger le code contre un token...");
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log("Réponse reçue après échange du code :", tokenResponse.data);

    const { access_token, token_type } = tokenResponse.data;

    // Utiliser le token pour obtenir les informations utilisateur
    console.log("Envoi de la requête pour obtenir les informations utilisateur avec le token...");
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const userInfo = userResponse.data;

    console.log("Informations utilisateur récupérées :", userInfo);

    
    currentUser = userInfo;

    // Rediriger vers le frontend (ou une page de succès)
    res.redirect('http://localhost:5173');
  } catch (error) {
    console.error('Erreur lors de la récupération du token Discord :', error);
    res.status(500).send('Erreur lors de la connexion avec Discord');
  }
};
