import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";  
import { GameTypeEnum } from "../types/TypeGame.enum";

export const createGame = async (req: Request, res: Response): Promise<void> => {
  const { name, description, gameTypeName  } = req.body;

  if (!name || !gameTypeName ) {
    res.status(400).send('Nom du jeu et ID du type de jeu sont requis');
    return;
  }

  const validGameTypes = Object.values(GameTypeEnum);

  if (!validGameTypes.includes(gameTypeName )) {
    res.status(400).send('Le type de jeu spécifié est invalide');
    return;
  }

  try {
    const gameType = await prisma.gameType.findFirst({
      where: {
        name: gameTypeName, 
      },
    });
    if (!gameType) {
      res.status(400).send('Le type de jeu spécifié n\'existe pas');
      return;
    }

    const newGame = await prisma.game.create({
      data: {
        name,
        description,  
        gameTypeId: gameType.id,
      },
    });

    console.log('Jeu créé avec succès:', newGame);
    res.status(201).json(newGame);  
  } catch (error) {
    console.error('Erreur lors de la création du jeu:', error);
    res.status(500).send('Erreur lors de la création du jeu');
  }
};


export const getGame = async (req: Request, res: Response): Promise<void> => {
  
  try {
    const game = await prisma.game.findMany()
    res.status(200).json(game);

  } catch (error) {
    console.error('Erreur lors de la récupération des jeux: ', error)
    res.status(500).send('Erreur lors de la récupération des jeux');
  }
};