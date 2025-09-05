import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { validateOrReject } from "class-validator";
import { JWT_ACCESS_TOKEN_SECRET } from "../../../../common/configs/config";
import { JwtPayload } from "../dto";

export const initializeJwtStrategy = (): void => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_ACCESS_TOKEN_SECRET
  };

  passport.use(
    new Strategy(opts, async (payload: JwtPayload, done) => {
      try {
        if (!payload) {
          return done(null, false);
        }

        const payloadDto = Object.assign(new JwtPayload(), payload);
        await validateOrReject(payloadDto);

        return done(null, payload);
      } catch (errors) {
        return done(null, false);
      }
    })
  );
};
