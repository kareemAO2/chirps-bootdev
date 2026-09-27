import { Router, Request, Response } from "express";
import { configObj } from "../config.js";
import { hitsReset } from "../handlers/HitsHandler.js";
import { handlerReadiness } from "../handlers/HandlerReadiness.js";

const adminRouter = Router();

adminRouter.get("/api/healthz", handlerReadiness);
adminRouter.get("/admin/metrics", (req: Request, res: Response) => {
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
adminRouter.post("/admin/reset", hitsReset);

export default adminRouter;
