import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../middlewares/isAdminMiddleware";
import { TournamentTypeEnum } from "../types/TypeTournament.enum";
import { console } from "inspector";

export const createTournament = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    name,
    description,
    tournamentDate,
    gameId,
    registrationStart,
    registrationEnd,
    condition_participation,
    maxPlayers,
    playersPerTeam,
  } = req.body;

  if (!name || !gameId || !maxPlayers || !playersPerTeam) {
    res.status(400).send("Champs obligatoires manquants");
    return;
  }

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      res.status(400).send("Le jeu spécifié n'existe pas");
      return;
    }

    const newTournament = await prisma.tournament.create({
      data: {
        name,
        description,
        condition_participation,
        maxPlayers,
        playersPerTeam,
        gameId,
        tournamentDate: new Date(tournamentDate),
        registrationStart: new Date(registrationStart),
        registrationEnd: new Date(registrationEnd),
      },
    });

    res.status(201).json(newTournament);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création du tournoi");
  }
};

export const getTournament = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tournaments = await prisma.tournament.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        registrationStart: true,
        registrationEnd: true,
        tournamentDate: true,
        maxPlayers: true,
        playersPerTeam: true,
        game: {
          select: {
            name: true,
            image_url: true,
          },
        },
      },
    });

    res.status(200).json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des tournois");
  }
};

export const addResultToTournament = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { tournamentId, teamId, score, rank } = req.body;

  if (!tournamentId || !teamId) {
    res.status(400).send("Champs requis manquants");
    return;
  }

  try {
    const existingResult = await prisma.tournamentResult.findUnique({
      where: {
        tournamentId_teamId: {
          tournamentId,
          teamId,
        },
      },
    });

    if (existingResult) {
      const updatedResult = await prisma.tournamentResult.update({
        where: { id: existingResult.id },
        data: { score, rank },
      });
      res.status(200).json(updatedResult);
    } else {
      const newResult = await prisma.tournamentResult.create({
        data: {
          tournamentId,
          teamId,
          score,
          rank,
        },
      });
      res.status(201).json(newResult);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de l'ajout du résultat");
  }
};

export const seeDetailTournament = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        game: true,
        teams: {
          include: {
            members: {
              include: { user: true },
            },
          },
        },
        results: {
          include: {
            team: {
              include: {
                members: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      res.status(404).send("Tournoi non trouvé");
      return;
    }

    res.status(200).json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};

export const getAdminTournament = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const Tournament = await prisma.tournament.findMany({
      include: {
        game: true,
        teams: true,
        results: true,
      },
    });

    res.status(200).json(Tournament);
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux: ", error);
    res.status(500).send("Erreur lors de la récupération des jeux");
  }
};
