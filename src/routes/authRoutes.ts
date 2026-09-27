import { Router } from "express";
import { handlerLogin } from "../handlers/auth/HandlerLogin.js";
import { handlerRefresh } from "../handlers/auth/HandlerRefresh.js";
import { handlerRevoke } from "../handlers/auth/HandlerRevoke.js";

const authRouter = Router();

authRouter.post("/api/login", handlerLogin);
authRouter.post("/api/refresh", handlerRefresh);
authRouter.post("/api/revoke", handlerRevoke);

export default authRouter;
