import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { AppStoreProductTransaction } from "./app-store-product-transaction.entity";
import { EAppStoreProductType } from "../common/enums";
import { SubscriptionPlan } from "../../subscription-plan/schemas";

@Entity({ name: "app_store_product" })
export class AppStoreProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    name: "product_type",
    enum: EAppStoreProductType
  })
  productType: EAppStoreProductType;

  @Column({ type: "varchar", name: "product_id" })
  productId: string;

  @Column({ type: "varchar", name: "name" })
  name: string;

  @Column({ type: "integer", name: "discount" })
  discount: number;

  @Column({ type: "integer", name: "quantity" })
  quantity: number;

  @OneToMany(
    () => AppStoreProductTransaction,
    (appStoreProductTransactions) => appStoreProductTransactions.appStoreProduct
  )
  appStoreProductTransactions: AppStoreProductTransaction[];

  @OneToOne(() => SubscriptionPlan, (subscriptionPlan) => subscriptionPlan.appStoreProduct, { nullable: true })
  @JoinColumn({
    name: "subscription_plan_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "app_store_product_subscription_plan_FK"
  })
  subscriptionPlan: SubscriptionPlan | null;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
