import { Router } from "express";
import { isAuth } from "../middlewares/isAuth";
import { unregisterFromTournament } from "../controllers/tournamentRegistration";

const teamsRoutes = Router();

teamsRoutes.delete("/:teamId", isAuth, unregisterFromTournament);

export default teamsRoutes;
