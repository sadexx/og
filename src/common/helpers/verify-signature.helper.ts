import crypto from "node:crypto";
import { TRANSACTION_SECRET } from "../configs/config";

export function verifySignature(userId: string, receivedSignature: string): boolean {
  const dateString = new Date().toDateString();
  const payload = `${dateString}:${userId}`;
  const expectedSignature = crypto.createHmac("sha256", TRANSACTION_SECRET).update(payload).digest("hex");

  return expectedSignature === receivedSignature;
}
