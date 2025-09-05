import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import * as jwt from "jsonwebtoken";
import jwksRsa, { JwksClient } from "jwks-rsa";
import { JwtHeader } from "jsonwebtoken";
import { InternalServerError, UnauthorizedException } from "../../../common/exceptions";
import { AppleLoginDto } from "../common/dto";
import { AppleTokenResponse } from "../common/interfaces";
import { AppleTokenOutput } from "../common/outputs";
import { User } from "../../users/schemas";
import { UserService } from "../../users/services";

export class AppleAuthService {
  private readonly usersRepository: Repository<User>;

  constructor(private readonly userService = new UserService()) {
    this.usersRepository = AppDataSource.getRepository(User);
  }

  public async processAppleLogin(dto: AppleLoginDto): Promise<User> {
    const { appleToken } = dto;

    const { email: appleEmail, emailVerified } = await this.validateAppleTokenAndGetEmail(appleToken);

    let isEmailConfirmed: boolean = false;

    if (typeof emailVerified === "boolean") {
      isEmailConfirmed = emailVerified;
    }

    if (typeof emailVerified === "string") {
      isEmailConfirmed = emailVerified === "true";
    }

    let user = await this.usersRepository.findOne({
      select: { id: true, email: true, name: true, isDeactivated: true },
      where: { email: appleEmail }
    });

    if (!user) {
      user = this.usersRepository.create({
        email: appleEmail,
        password: "",
        isEmailConfirmed: isEmailConfirmed
      });

      await this.usersRepository.save(user);
      await this.userService.createUserSettings(user.id);
    }

    return user;
  }

  private async validateAppleTokenAndGetEmail(identityToken: string): Promise<AppleTokenOutput> {
    const appleJwksUrl = "https://appleid.apple.com/auth/keys";

    const client: JwksClient = jwksRsa({
      jwksUri: appleJwksUrl
    });

    const getApplePublicKey = (header: JwtHeader, callback: jwt.SigningKeyCallback): void => {
      client.getSigningKey(header.kid as string, (err, key) => {
        if (err || !key) {
          callback(err || new InternalServerError("Authentication failed"), undefined);

          return;
        }

        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      });
    };

    return new Promise((resolve, reject) => {
      jwt.verify(
        identityToken,
        getApplePublicKey,
        {
          algorithms: ["RS256"],
          issuer: "https://appleid.apple.com"
        },
        (err, decoded) => {
          if (err) {
            if (err instanceof jwt.TokenExpiredError) {
              reject(new UnauthorizedException("Authentication failed"));
            } else {
              reject(new UnauthorizedException("Authentication failed"));
            }
          } else if (!decoded || typeof decoded === "string") {
            reject(new UnauthorizedException("Authentication failed"));
          } else {
            const payload = decoded as AppleTokenResponse;
            resolve({
              email: payload.email || payload.sub,
              emailVerified: payload.email_verified
            });
          }
        }
      );
    });
  }
}
