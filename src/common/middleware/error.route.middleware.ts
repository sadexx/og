import { type NextFunction, type Request, type Response } from "express";
import { EHttpResponseCode } from "../enums";

export const errorRouteMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(EHttpResponseCode.NOT_FOUND).json({ [req.path]: "Not correct path" });
  } catch (e) {
    next(e);
  }
};
