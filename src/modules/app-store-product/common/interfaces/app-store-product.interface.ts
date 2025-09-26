import { SubscriptionPlan } from "../../../subscription-plan/schemas";
import { EAppStoreProductType } from "../enums";

export interface IAppStoreProduct {
  productType: EAppStoreProductType;
  productId: string;
  name: string;
  discount: number;
  quantity: number;
  subscriptionPlan: SubscriptionPlan | null;
}
