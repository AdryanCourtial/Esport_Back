import { Router } from "express";
import { getUsers } from "../controllers/userController";

const router = Router();

// Route pour récupérer tous les utilisateurs
router.get("/users", getUsers);

export default router;
