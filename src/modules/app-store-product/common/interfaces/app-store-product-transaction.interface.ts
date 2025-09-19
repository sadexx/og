import { User } from "../../../users/schemas";
import { AppStoreProduct } from "../../schemas";
import { ECurrencyEnum } from "../enums";

export interface IAppStoreProductTransaction {
  transactionId: string;
  transactionOriginalId: string;
  price: number;
  currency: ECurrencyEnum;
  purchasedQuantity: number;
  purchaseDate: Date;
  originalPurchaseDate: Date;
  appStoreProduct: AppStoreProduct;
  user: User | null;
}
