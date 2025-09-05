import { NextFunction, Request, Response } from "express";
import { ERole } from "../../modules/users/common/enums";
import { EHttpResponseCode } from "../enums";
import { JwtPayload } from "../../modules/auth/common/dto";

export function roleGuard(allowedRoles: ERole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as JwtPayload;

    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      res.status(EHttpResponseCode.FORBIDDEN).json({ message: "Forbidden request" });

      return;
    }

    next();
  };
}
