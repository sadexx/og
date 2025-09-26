import {
  JWSTransactionDecodedPayload,
  ResponseBodyV2DecodedPayload,
  SignedDataVerifier
} from "@apple/app-store-server-library";
import path from "node:path";
import fs from "node:fs";
import { APPLE_APP_ID, APPLE_BUNDLE_ID, APPLE_ENVIRONMENT } from "../../../common/configs/config";
import { UnauthorizedException } from "../../../common/exceptions";
import { logger } from "../../../setup/logger";

export class AppStoreTransactionVerificationService {
  private readonly verifier: SignedDataVerifier;

  constructor() {
    const enableOnlineChecks = true;
    const appleRootCAs: Buffer[] = this.loadAppleRootCertificates();

    this.verifier = new SignedDataVerifier(
      appleRootCAs,
      enableOnlineChecks,
      APPLE_ENVIRONMENT,
      APPLE_BUNDLE_ID,
      APPLE_APP_ID
    );
  }

  /**
   * Verifies and decodes Apple transaction JWS token
   * @param jwsRepresentation - The transaction JWS token to verify
   * @returns Decoded and verified transaction payload
   */
  public async verifyAndDecodeTransaction(jwsRepresentation: string): Promise<JWSTransactionDecodedPayload> {
    try {
      const decodedTransaction = await this.verifier.verifyAndDecodeTransaction(jwsRepresentation);

      return decodedTransaction;
    } catch (error) {
      logger.error(`Failed to verify Apple jwsRepresentation: ${(error as Error).message}`);
      throw new UnauthorizedException("Apple jwsRepresentation verification failed.");
    }
  }

  /**
   * Verifies and decodes Apple webhook notification
   * @param signedPayload - The webhook signedPayload to verify
   * @returns Decoded and verified webhook payload
   */
  public async verifyAndDecodeWebhook(signedPayload: string): Promise<ResponseBodyV2DecodedPayload> {
    try {
      const decodedNotification = await this.verifier.verifyAndDecodeNotification(signedPayload);

      return decodedNotification;
    } catch (error) {
      logger.error(`Failed to verify Apple webhook signedPayload: ${(error as Error).message}`);
      throw new UnauthorizedException("Apple webhook signedPayload verification failed.");
    }
  }

  /**
   * Loads the Apple Root CA certificate required for verifying signed
   * App Store JWS tokens (transactions, notifications, and renewal info).
   */
  private loadAppleRootCertificates(): Buffer[] {
    const certificatePath = path.join(__dirname, "../common/certificates/AppleRootCA-G3.cer");

    if (!fs.existsSync(certificatePath)) {
      throw new Error(`Apple Root CA certificate not found at: ${certificatePath}`);
    }

    const appleRootCA = fs.readFileSync(certificatePath);

    return [appleRootCA];
  }
}
