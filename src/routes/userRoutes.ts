import { Router } from "express";
import { createUserHandler } from "../handlers/users/createUserHandler.js";
import { handlerEditUser } from "../handlers/users/HandlerEditUser.js";

const userRouter = Router();

userRouter.post("/api/users", createUserHandler);
userRouter.put("/api/users", handlerEditUser);

export default userRouter;
