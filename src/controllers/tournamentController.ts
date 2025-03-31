import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";  
import { isAdmin } from "../middlewares/isAdminMiddleware";
import { TournamentTypeEnum } from "../types/TypeTournament.enum";
import { console } from "inspector";

export const createTournament = async (req: Request, res: Response): Promise<void> => {
  const { name, description, TournamentTypeName, tournamentDate, Game, registrationStart, registrationEnd } = req.body;

  console.log("je suis les infos renvoyé par la création de tournois", name, description, TournamentTypeName, tournamentDate, Game, registrationStart, registrationEnd)

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

    const GameChoise = await prisma.game.findFirst({
      where: {
        name: Game,
      },
    });
    if (!GameChoise) {
      res.status(400).send('Le jeu spécifié n\'existe pas');
      return;
    }

    const newTournament = await prisma.tournament.create({
      data: {
        name,
        description,  
        tournamentTypeId: TournamentType.id,
        gameId: GameChoise?.id,
        tournamentDate: new Date(tournamentDate),
        registrationStart: new Date(registrationStart),
        registrationEnd: new Date(registrationEnd),

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
        registrationStart: true,
        registrationEnd: true,
        tournamentDate: true,
        tournamentType: {
          select: {
            name:true
          }
        },
        game: {
          select: {
            name: true,
            image_url: true,
          }
        },
        },
    })
    
    res.status(200).json(Tournament);

  } catch (error) {
    console.error('Erreur lors de la récupération des jeux: ', error)
    res.status(500).send('Erreur lors de la récupération des jeux');
  }
};


export const addResultToTournament = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId, userId, score } = req.body;

  if (!tournamentId || !userId || score === undefined) {
    res.status(400).send('Tous les champs sont requis');
    return;
  }

  try {
    const existingResult = await prisma.tournamentResult.findFirst({
      where: {
        userId: userId,
        tournamentId: tournamentId,
      },
    });

    if (existingResult) {
      const updatedResult = await prisma.tournamentResult.update({
        where: { id: existingResult.id },
        data: { score },
      });
      res.status(200).json(updatedResult);
    } else {
       const newResult = await prisma.tournamentResult.create({
        data: {
          tournamentId,
          userId,
          score,
        },
      });
      res.status(201).json(newResult);
    }
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout ou de la mise à jour des résultats');
  }
};


export const seeDetailTournament = async (req: Request, res: Response): Promise<void> => {
  try {
      const { id } = req.params;

    const Tournament = await prisma.tournament.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        tournamentType: {
          select: {
            name: true,
          },
        },
        game: {
          select: {
            name: true,
            image_url: true,
          },
        },
        tournamentDate: true,
      },
    });

    if (!Tournament) {
      res.status(404).send("Tournoi non trouvé");
      return; 
    }

    console.log("Je suis les tournois", Tournament);

    res.status(200).json(Tournament);
  } catch (error) {
    console.error("Erreur lors de la récupération du tournoi:", error);
    res.status(500).send("Erreur serveur");
  }
};



export const getAdminTournament = async (req: Request, res: Response): Promise<void> => {
  
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
        },
        game: {
          select: {
            name: true,
            image_url: true,
          },
        },
        },
    })


    res.status(200).json(Tournament);

  } catch (error) {
    console.error('Erreur lors de la récupération des jeux: ', error)
    res.status(500).send('Erreur lors de la récupération des jeux');
  }
};