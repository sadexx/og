import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { AppStoreProduct } from "./app-store-product.entity";
import { ECurrencyEnum } from "../common/enums";
import { User } from "../../users/schemas";

@Entity({ name: "app_store_product_transaction" })
export class AppStoreProductTransaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "transaction_id" })
  transactionId: string;

  @Column({ type: "varchar", name: "transaction_original_id" })
  transactionOriginalId: string;

  @Column({ type: "decimal", name: "price" })
  price: number;

  @Column({
    type: "enum",
    name: "currency",
    enum: ECurrencyEnum
  })
  currency: ECurrencyEnum;

  @Column({ type: "integer", name: "purchased_quantity" })
  purchasedQuantity: number;

  @Column({ type: "timestamp", name: "purchase_date" })
  purchaseDate: Date;

  @Column({ type: "timestamp", name: "original_purchase_date" })
  originalPurchaseDate: Date;

  @ManyToOne(() => AppStoreProduct, (appStoreProduct) => appStoreProduct.appStoreProductTransactions)
  @JoinColumn({
    name: "app_store_product_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "app_store_product_transaction_app_store_product_FK"
  })
  appStoreProduct: AppStoreProduct;

  @ManyToOne(() => User, (user) => user.appStoreProductTransactions, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "app_store_product_transaction_user_FK"
  })
  user: User | null;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
