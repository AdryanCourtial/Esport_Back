import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import axios from "axios";
import config from "../../config.json";
import { DiscordUserInfo } from "../types/discordUserInfo.type";
import { RoleUserEnum } from "../types/RoleUser.enum";

export const getUserInfo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (req.session.user) {
    const userId = req.session.user.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        username: true,
        lastName: true,
        firstName: true,
        avatar: true,
        discordId: true,
        role: {
          select: {
            role: true,
          },
        },
      },
    });

    res.json(user);
  } else {
    console.log("Utilisateur non connecté");
    res.status(401).send("Utilisateur non connecté");
  }
};

export const redirectToDiscord = (req: Request, res: Response): void => {
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=identify`;
  console.log("Redirection vers Discord avec l'URL :", discordAuthUrl);
  res.redirect(discordAuthUrl);
};

export const handleCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    console.log("Code d'autorisation non trouvé dans la requête de callback");
    res.status(400).send("Code non trouvé.");
    return;
  }

  try {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const { access_token, token_type } = tokenResponse.data;

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const userInfo: DiscordUserInfo = userResponse.data;
    console.log("Informations utilisateur récupérées :", userInfo);

    (req.session as any).discordUser = userInfo;

    let user = await prisma.user.findUnique({
      where: {
        discordId: userInfo.id,
      },
      include: {
        role: true,
      },
    });

    if (user) {
      console.log("ID de l'utilisateur dans la base de données : ", user.id);

      (req.session as any).user = {
        id: user.id,
        username: user.username,
        role: user.role?.role,
      };

      res.redirect(process.env.FRONT_URL + "/home");
    } else {
      res.redirect(process.env.FRONT_URL + "/completed-profil");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token Discord :", error);
    res.status(500).send("Erreur lors de la connexion avec Discord");
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { firstName, lastName, email, sector_id } = req.body;

  if (!firstName || !lastName || !email || !sector_id) {
    res.status(400).send("Prénom, nom, secteur et email sont requis");
    return;
  }

  const discordUser = (req.session as any).discordUser as
    | DiscordUserInfo
    | undefined;

  if (!discordUser) {
    res.status(401).send("Session Discord expirée ou inexistante");
    return;
  }

  const roleUser = RoleUserEnum.USER;

  const role = await prisma.role.findFirst({
    where: {
      role: roleUser.toString(),
    },
  });

  const sector_user = await prisma.sector.findUnique({
    where: {
      id: sector_id,
    },
  });

  if (!role) {
    res.status(400).send("Rôle utilisateur introuvable");
    return;
  }

  if (!sector_user) {
    res.status(400).send("Secteur introuvable");
    return;
  }

  try {
    const updatedUser = await prisma.user.create({
      data: {
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
        globalName: discordUser.global_name,
        accentColor: discordUser.accent_color,
        bannerColor: discordUser.banner_color,
        locale: discordUser.locale,
        mfaEnabled: discordUser.mfa_enabled,
        premiumType: discordUser.premium_type,
        publicFlags: discordUser.public_flags,
        flags: discordUser.flags,
        firstName,
        lastName,
        email,
        role: {
          connect: {
            id: role.id,
          },
        },
        sector: {
          connect: {
            id: sector_user.id,
          },
        },
      },
    });

    (req.session as any).user = {
      id: updatedUser.id,
      username: updatedUser.username,
      role: role.role,
    };

    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Erreur lors de la mise à jour du profil");
  }
};

export const logout = (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).send("Erreur lors de la déconnexion");
    }

    res.clearCookie("connect.sid");

    res.status(200).send("Déconnecté avec succès");
  });
};

export const reconnectUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (req.session.user) {
    const userId = req.session.user.id;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          username: true,
          lastName: true,
          firstName: true,
          avatar: true,
          discordId: true,
          role: {
            select: {
              role: true,
            },
          },
        },
      });

      if (user) {
        res.json(user);
      } else {
        res.status(404).send("Utilisateur non trouvé dans la base de données");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      res.status(500).send("Erreur lors de la récupération de l'utilisateur");
    }
  } else {
    // Si l'utilisateur n'est pas connecté, on retourne une erreur
    res.status(401).send("Utilisateur non connecté");
  }
};

export const getSectors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const sectors = await prisma.sector.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.json(sectors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Aucun secteur récupéré");
  }
};
