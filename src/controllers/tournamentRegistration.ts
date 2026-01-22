import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

/////////////////////////////
// INSCRIPTION AU TOURNOI //
/////////////////////////////

export const registerForTournamentTeam = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { teamName, memberIds } = req.body;
  const tournamentId = req.params.tournamentId;
  const captainId = req.session.user?.id;

  if (!captainId) {
    res.status(401).send("Utilisateur non connecté");
    return;
  }

  if (!tournamentId) {
    res.status(400).send("ID du tournoi requis");
    return;
  }

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { teams: { include: { members: true } } },
    });

    if (!tournament) {
      res.status(404).send("Tournoi introuvable");
      return;
    }

    const now = new Date();
    if (tournament.registrationEnd < now) {
      res.status(400).send("Les inscriptions sont terminées");
      return;
    }
    if (tournament.registrationStart > now) {
      res.status(400).send("Les inscriptions n'ont pas encore commencé");
      return;
    }

    // Vérifie que le capitaine n'est pas déjà inscrit
    const isAlreadyInTournament = tournament.teams.some(
      (team) =>
        team.captainId === captainId ||
        team.members.some((m) => m.userId === captainId),
    );
    if (isAlreadyInTournament) {
      res.status(400).send("Vous êtes déjà inscrit à ce tournoi");
      return;
    }

    // Vérifie que les membres proposés ne sont pas déjà inscrits
    if (memberIds && memberIds.length > 0) {
      for (const memberId of memberIds) {
        const alreadyRegistered = tournament.teams.some(
          (team) =>
            team.captainId === memberId ||
            team.members.some((m) => m.userId === memberId),
        );
        if (alreadyRegistered) {
          res
            .status(400)
            .send(`Le joueur ${memberId} est déjà inscrit au tournoi`);
          return;
        }
      }
    }

    // Vérifie la taille de l'équipe
    const totalPlayers = 1 + (memberIds?.length || 0);
    if (totalPlayers > tournament.playersPerTeam) {
      res
        .status(400)
        .send(
          `L'équipe ne peut pas dépasser ${tournament.playersPerTeam} joueurs`,
        );
      return;
    }

    // Création de la team
    const newTeam = await prisma.team.create({
      data: {
        name: teamName || `Team de ${req.session.user?.username}`,
        status:
          totalPlayers === tournament.playersPerTeam
            ? "COMPLETE"
            : "INCOMPLETE",
        tournamentId: tournament.id,
        captainId,
        members: {
          create: memberIds?.map((userId: string) => ({ userId })) || [],
        },
      },
      include: {
        members: true,
      },
    });

    res
      .status(201)
      .json({ message: "Équipe inscrite avec succès", team: newTeam });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de l'inscription au tournoi");
  }
};

////////////////////////////////////
// DÉSINSCRIPTION AU TOURNOI //
////////////////////////////////////

export const unregisterFromTournament = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { teamId } = req.params;
  const userId = req.session.user?.id;

  if (!userId || !teamId) {
    res.status(400).send("ID du tournoi ou de l'utilisateur manquant");
    return;
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      res.status(404).send("Équipe introuvable");
      return;
    }

    if (team.captainId === userId) {
      // Capitaine -> supprime toute l'équipe
      await prisma.team.delete({ where: { id: teamId } });
      res.status(200).json({ message: "Équipe supprimée" });
    } else {
      // Membre -> supprime juste le membre
      const member = team.members.find((m) => m.userId === userId);
      if (!member) {
        res.status(400).send("Vous n'êtes pas membre de cette équipe");
        return;
      }
      await prisma.teamMember.delete({ where: { id: member.id } });
      res.status(200).json({ message: "Vous avez quitté l'équipe" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la désinscription du tournoi");
  }
};

////////////////////////////////////
// VÉRIFICATION INSCRIPTION //
////////////////////////////////////

export const checkRegistration = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { tournamentId } = req.body;
  const userId = req.session.user?.id;

  if (!userId || !tournamentId) {
    res.status(400).send("ID du tournoi ou de l'utilisateur manquant");
    return;
  }

  try {
    const teams = await prisma.team.findMany({
      where: {
        tournamentId,
        OR: [{ captainId: userId }, { members: { some: { userId } } }],
      },
    });

    res.status(200).json({ isRegistered: teams.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la vérification de l'inscription");
  }
};
