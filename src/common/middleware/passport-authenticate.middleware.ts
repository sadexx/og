import passport from "passport";
import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../enums";

export function customPassportAuthenticate(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate("jwt", { session: false }, (err: Error, user: Express.User) => {
    if (err || !user) {
      res.status(EHttpResponseCode.UNAUTHORIZED).json({ message: "Unauthorized" });

      return;
    }

    req.user = user;
    next();
  })(req, res, next);
}
