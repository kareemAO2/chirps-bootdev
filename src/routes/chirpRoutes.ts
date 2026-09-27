import { Router } from "express";
import { handlerCreateChirp } from "../handlers/chirps/HandlerCreateChirp.js";
import { handlerGetChirps } from "../handlers/chirps/HandlerGetChirps.js";
import { handlerGetChirp } from "../handlers/chirps/HandlerGetChirp.js";
import { handlerDeleteChirp } from "../handlers/chirps/HandlerDeleteChirp.js";

const chirpRouter = Router();

chirpRouter.post("/api/chirps", handlerCreateChirp);
chirpRouter.get("/api/chirps", handlerGetChirps);
chirpRouter.get("/api/chirps/:chirpId", handlerGetChirp);
chirpRouter.delete("/api/chirps/:chirpId", handlerDeleteChirp);

export default chirpRouter;
