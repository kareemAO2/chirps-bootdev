import express, { NextFunction } from "express";
import { handlerReadiness } from "./handlers/HandlerReadiness.js";
import { middlewareLogResponses } from "./middlewares/MiddlewareLogResponses.js";
import { middlewareMetricsInc } from "./middlewares/MiddlewareMetricsInc.js";
import { hitsReset } from "./handlers/HitsHandler.js";
import { Request, Response } from "express";
import { configObj } from "./config.js";
import { BadRequestError } from "./handlers/BadRequestError.js";
import { createUserHandler } from "./handlers/createUserHandler.js";
import { handlerCreateChirp } from "./handlers/HandlerCreateChirp.js";
import { handlerGetChirps } from "./handlers/HandlerGetChirps.js";
import { handlerGetChirp } from "./handlers/HandlerGetChirp.js";
import { handlerLogin } from "./handlers/HandlerLogin.js";
import { handlerRefresh } from "./handlers/HandlerRefresh.js";
import { handlerRevoke } from "./handlers/HandlerRevoke.js";
import { handlerEditUser } from "./handlers/HandlerEditUser.js";
import { handlerDeleteChirp } from "./handlers/HandlerDeleteChirp.js";
import { handlerWebhooks } from "./handlers/HandlerWebhooks.js";

process.loadEnvFile();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", (req: Request, res: Response) => {
  const fileVisited = configObj.fileserverHits;
  const htmlContent = `
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${fileVisited} times!</p>
      </body>
    </html>
  `;

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(htmlContent);
});
app.post("/admin/reset", hitsReset);

app.post("/api/users", createUserHandler);
app.post("/api/chirps", handlerCreateChirp);
app.get("/api/chirps", handlerGetChirps);
app.get("/api/chirps/:chirpId", handlerGetChirp);
app.post("/api/login", handlerLogin);
app.post("/api/refresh", handlerRefresh);
app.post("/api/revoke", handlerRevoke);
app.put("/api/users", handlerEditUser);
app.delete("/api/chirps/:chirpId", handlerDeleteChirp);
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
