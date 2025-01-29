import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";  
import { GameTypeEnum } from "../types/TypeGame.enum";


export const registerForGame = async (req: Request, res: Response): Promise<void> => {
  const { gameId } = req.body;  
  const userId = req.session.user?.id;  

  console.log('Utilisateur connecté:', req.session.user);

  if (!userId) {
    res.status(401).send('Utilisateur non connecté');
    return;
  }

  if (!gameId) {
    res.status(400).send('L\'ID du tournoi est requis');
    return;
  }

  try {
    const existingRegistration = await prisma.gameRegistration.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: gameId,
        }
      }
    });

    if (existingRegistration) {
      res.status(400).send('L\'utilisateur est déjà inscrit à ce tournoi');
      return;
    }

    // Inscrire l'utilisateur au tournoi
    const registration = await prisma.gameRegistration.create({
      data: {
        userId: userId,
        gameId: gameId,
      },
    });

    res.status(201).json({ message: 'Inscription réussie', registration });
  } catch (error) {
    console.error('Erreur lors de l\'inscription au tournoi:', error);
    res.status(500).send('Erreur lors de l\'inscription au tournoi');
  }
};