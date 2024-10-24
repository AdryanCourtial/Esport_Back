import { Request, Response } from "express";
import { getAllUsers } from "../services/userService";

// Récupère tous les utilisateurs et renvoie la réponse
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);  // Retourne les utilisateurs sous forme de JSON
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};
