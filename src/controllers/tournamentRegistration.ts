import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";  


export const registerForTournamentTeam = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId, team } = req.body;
  const userId = req.session.user?.id;

  console.log('Utilisateur connecté:', req.session.user);

  if (!userId) {
    res.status(401).send('Utilisateur non connecté');
    return;
  }

  if (!tournamentId) {
    res.status(400).send('L\'ID du tournoi est requis');
    return;
  }

  try {
    const tournament = await prisma.tournament.findUnique({
      where: {
          id: tournamentId
      },
      select: {
        registrationEnd: true,
        registrationStart: true,
      }
    })
    
    

  } catch (error) {
    res.status(500).send('Erreur lors de l\'inscription au tournoi');
  }

};

export const registerForTournament = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = req.body;  
  const userId = req.session.user?.id;  

  console.log('Utilisateur connecté:', req.session.user);

  if (!userId) {
    res.status(401).send('Utilisateur non connecté');
    return;
  }

  if (!tournamentId) {
    res.status(400).send('L\'ID du tournoi est requis');
    return;
  }

  try {

    const tournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      select: {
        registrationEnd: true,
        registrationStart: true,
      },
    });

    if (tournament?.registrationEnd && new Date(tournament.registrationEnd) < new Date()) {
      res.status(400).send('Les inscriptions pour ce tournoi sont terminées');
      return;
    }
    
    if (tournament?.registrationStart && new Date(tournament.registrationStart) > new Date()) {
      res.status(400).send('Les inscriptions pour ce tournoi n\'ont pas encore commencé');
      return;
    }

    const existingRegistration = await prisma.tournamentRegistration.findUnique({
      where: {
        userId_TournamentId: {
          userId: userId,
          TournamentId: tournamentId,
        }
      }
    });

    if (existingRegistration) {
      res.status(400).send('L\'utilisateur est déjà inscrit à ce tournoi');
      return;
    }

    const registration = await prisma.tournamentRegistration.create({
      data: {
        userId: userId,
        TournamentId: tournamentId,
      },
    });

    res.status(201).json({ message: 'Inscription réussie', registration });
  } catch (error) {
    console.error('Erreur lors de l\'inscription au tournoi:', error);
    res.status(500).send('Erreur lors de l\'inscription au tournoi');
  }
};

export const unregisterForGame = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = req.body;
  const userId = req.session.user?.id;

  if (!userId || !tournamentId) {
    res.status(400).send("ID du tournoi ou de l'utilisateur manquant");
    return
  }

  try {
    const registration = await prisma.tournamentRegistration.delete({
      where: {
        userId_TournamentId: {
          userId: userId,
          TournamentId: tournamentId,
        },
      },
    });

    res.status(200).json({ message: "Désinscription réussie", registration });
  } catch (error) {
    console.error("Erreur lors de la désinscription :", error);
    res.status(500).send("Erreur lors de la désinscription du tournoi");
  }
};


export const checkRegistration = async (req: Request, res: Response): Promise<void> => {
  const { tournamentId } = req.body;
  const userId = req.session.user?.id;

  if (!userId || !tournamentId) {
    res.status(400).send("ID du tournoi ou de l'utilisateur manquant");
    return
  }

  try {
    const existingRegistration = await prisma.tournamentRegistration.findUnique({
      where: {
        userId_TournamentId: {
          userId: userId,
          TournamentId: tournamentId,
        },
      },
    });

    res.status(200).json({ isRegistered: existingRegistration !== null });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'inscription:', error);
    res.status(500).send('Erreur lors de la vérification de l\'inscription');
  }
};
