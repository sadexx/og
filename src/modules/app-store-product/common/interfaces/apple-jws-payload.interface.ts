import { ECurrencyEnum } from "../enums";

export interface IAppleJwsPayload {
  appAccountToken: string;
  bundleId: string;
  productId: string;
  transactionId: string;
  originalTransactionId: string;
  price: number;
  currency: ECurrencyEnum;
  quantity: number;
  purchaseDate: number;
  originalPurchaseDate: number;
}
