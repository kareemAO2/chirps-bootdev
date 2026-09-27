import express, { NextFunction } from "express";
import { middlewareLogResponses } from "./middlewares/MiddlewareLogResponses.js";
import { middlewareMetricsInc } from "./middlewares/MiddlewareMetricsInc.js";
import { Request, Response } from "express";
import { BadRequestError } from "./handlers/BadRequestError.js";
import { handlerWebhooks } from "./handlers/HandlerWebhooks.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import chirpRouter from "./routes/chirpRoutes.js";
import userRouter from "./routes/userRoutes.js";

process.loadEnvFile();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(adminRouter);
app.use(userRouter);
app.use(chirpRouter);
app.use(authRouter);
app.post("/api/polka/webhooks", handlerWebhooks);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof BadRequestError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err?.status) {
    return res.status(err.status).json({ error: err.message });
  }
  return res.status(500).json({
    error: "Something went wrong on our end",
  });
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
