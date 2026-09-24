import { Request, Response, NextFunction } from "express";
import { getAuthorChirps, getChirps } from "../db/queries/chirps.js";
import { BadRequestError } from "./BadRequestError.js";
export async function handlerGetChirps(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let authorId = "";
  let authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }
  let sort: "asc" | "desc" = "asc";
  let sortQuery = req.query.sort;
  if (sortQuery !== "asc" && sortQuery !== "desc") {
    sortQuery = "asc";
  }
  if (typeof sortQuery === "string") {
    sort = sortQuery as "asc" | "desc";
  }
  let chirps = [];
  if (authorId !== "") {
    chirps = await getAuthorChirps(authorId, sort);
  } else {
    chirps = await getChirps(sort);
  }

  return res.status(200).json(chirps);
}
