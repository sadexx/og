import jwksRsa, { JwksClient, SigningKey } from "jwks-rsa";
import * as jwt from "jsonwebtoken";
import { JwtHeader, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { InternalServerError, UnauthorizedException } from "../../../common/exceptions";
import { logger } from "../../../setup/logger";
import { IAppleJwsPayload, IAppleWebhookPayload } from "../common/interfaces";
import { APPLE_BUNDLE_ID } from "../../../common/configs/config";

export class AppStoreTransactionVerificationService {
  private readonly jwksClient: JwksClient;

  private readonly JWKS_OPTIONS: jwksRsa.Options = {
    jwksUri: "https://appleid.apple.com/auth/keys",
    cache: true,
    cacheMaxAge: 86400000,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    timeout: 30000
  };

  private readonly JWT_OPTIONS: jwt.VerifyOptions = {
    algorithms: ["ES256"],
    issuer: "appstoreconnect-v1",
    clockTolerance: 60
  };

  constructor() {
    this.jwksClient = jwksRsa(this.JWKS_OPTIONS);
  }

  /**
   * Verifies and decodes Apple transaction JWS token
   * @param jws - The transaction JWS token to verify
   * @returns Decoded and verified transaction payload
   * @throws UnauthorizedException if verification fails
   */
  public async verifyAndDecodeTransactionJWS(jws: string): Promise<IAppleJwsPayload> {
    try {
      const payload = await this.verifyJWSSignature<IAppleJwsPayload>(jws);

      // Validate bundle ID for security
      if (payload.bundleId !== APPLE_BUNDLE_ID) {
        throw new UnauthorizedException(`Invalid bundle ID. Expected: ${APPLE_BUNDLE_ID}`);
      }

      return payload;
    } catch (error) {
      logger.error(`Failed to verify Apple transaction JWS: ${(error as Error).message}`);
      throw new UnauthorizedException("Invalid Apple JWS signature");
    }
  }

  /**
   * Verifies and decodes Apple webhook JWS token
   * @param jws - The webhook JWS token to verify
   * @returns Decoded and verified webhook payload
   * @throws UnauthorizedException if verification fails
   */
  public async verifyAndDecodeWebhookJWS(jws: string): Promise<IAppleWebhookPayload> {
    try {
      const payload = await this.verifyJWSSignature<IAppleWebhookPayload>(jws);

      return payload;
    } catch (error) {
      logger.error(`Failed to verify Apple webhook JWS: ${(error as Error).message}`);
      throw new UnauthorizedException("Invalid Apple webhook JWS signature");
    }
  }

  /**
   * Verifies the JWS signature using Apple's public key
   * @param jws - The JWS token to verify
   * @returns Promise that resolves to the decoded payload
   * @throws UnauthorizedException if signature verification fails
   * @private
   */
  private async verifyJWSSignature<ReturnType>(jws: string): Promise<ReturnType> {
    return new Promise<ReturnType>((resolve, reject) => {
      jwt.verify(
        jws,
        this.getApplePublicKey.bind(this),
        this.JWT_OPTIONS,
        (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
          if (err) {
            return reject(new UnauthorizedException(`JWS verification failed: ${err.message}`));
          }

          if (!decoded || typeof decoded === "string") {
            return reject(new UnauthorizedException("Invalid token payload"));
          }

          resolve(decoded as ReturnType);
        }
      );
    });
  }

  /**
   * Retrieves Apple's public key for JWT signature verification
   * @param header - JWT header containing the key ID
   * @param callback - Callback function to handle the retrieved key or error
   * @throws UnauthorizedException if 'kid' is missing from header
   * @throws InternalServerError if unable to retrieve signing key
   * @private
   */
  private getApplePublicKey(header: JwtHeader, callback: jwt.SigningKeyCallback): void {
    if (!header.kid) {
      return callback(new UnauthorizedException("Missing 'kid' in JWT header"));
    }

    this.jwksClient.getSigningKey(header.kid, (error: Error | null, key?: SigningKey) => {
      if (error) {
        logger.error("Failed to retrieve Apple signing key", { kid: header.kid, error: error.message });

        return callback(new InternalServerError("Unable to retrieve Apple signing key"));
      }

      if (!key) {
        return callback(new InternalServerError("Apple signing key not found"));
      }

      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }
}
