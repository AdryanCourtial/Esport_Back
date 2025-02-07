import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";  
import { isAdmin } from "../middlewares/isAdminMiddleware";
import { TournamentTypeEnum } from "../types/TypeTournament.enum";

export const createTournament = async (req: Request, res: Response): Promise<void> => {
  const { name, description, TournamentTypeName  } = req.body;

  console.log(name, description, TournamentTypeName)

  if (!name || !TournamentTypeName ) {
    res.status(400).send('Nom du jeu et ID du type de jeu sont requis');
    return;
  }

  const validTournamentTypes = Object.values(TournamentTypeEnum);

  if (!validTournamentTypes.includes(TournamentTypeName )) {
    res.status(400).send('Le type de jeu spécifié est invalide');
    return;
  }

  try {
    const TournamentType = await prisma.tournamentType.findFirst({
      where: {
        name: TournamentTypeName, 
      },
    });
    if (!TournamentType) {
      res.status(400).send('Le type de jeu spécifié n\'existe pas');
      return;
    }

    const newTournament = await prisma.tournament.create({
      data: {
        name,
        description,  
        tournamentTypeId: TournamentType.id,
      },
    });

    console.log('Jeu créé avec succès:', newTournament);
    res.status(201).json(newTournament);  
  } catch (error) {
    console.error('Erreur lors de la création du jeu:', error);
    res.status(500).send('Erreur lors de la création du jeu');
  }
};


export const getTournament = async (req: Request, res: Response): Promise<void> => {
  
  try {
    const Tournament = await prisma.tournament.findMany({
      select: {
          id: true,
        name: true,
        description: true,
        tournamentType: {
          select: {
            name:true
          }
        }
        },
    })
    
    res.status(200).json(Tournament);

  } catch (error) {
    console.error('Erreur lors de la récupération des jeux: ', error)
    res.status(500).send('Erreur lors de la récupération des jeux');
  }
};