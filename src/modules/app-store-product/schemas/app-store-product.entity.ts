import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AppStoreProductTransaction } from "./app-store-product-transaction.entity";

@Entity({ name: "app_store_product" })
export class AppStoreProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
