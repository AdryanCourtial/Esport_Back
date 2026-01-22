import { Router } from "express";

import {
  addResultToTournament,
  createTournament,
  getAdminTournament,
  getTournament,
  seeDetailTournament,
} from "../controllers/tournamentController";
import { isAdmin } from "../middlewares/isAdminMiddleware";
import { isAuth } from "../middlewares/isAuth";
import {
  checkRegistration,
  registerForTournamentTeam,
  unregisterFromTournament,
} from "../controllers/tournamentRegistration";

const tournamentRouter = Router();

tournamentRouter.post("/createTournament", isAdmin, createTournament);

tournamentRouter.get("/adminTournament", isAdmin, getAdminTournament);

tournamentRouter.get("/:id", seeDetailTournament);

tournamentRouter.post("/:id/addResult", isAdmin, addResultToTournament);

tournamentRouter.get("/", getTournament);

tournamentRouter.post("/checkRegistration", isAuth, checkRegistration);

tournamentRouter.post(
  "/:tournamentId/teams",
  isAuth,
  registerForTournamentTeam,
);

export default tournamentRouter;
