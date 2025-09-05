import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../users/schemas";
import { ETransactionDirection } from "../common/enums";

@Entity("coin-transaction")
export class CoinTransaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "integer", name: "amount" })
  amount: number;

  @Column({
    type: "enum",
    name: "direction",
    enum: ETransactionDirection
  })
  direction: ETransactionDirection;

  @ManyToOne(() => User, (user) => user.coinTransactions, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "coin-transaction_user"
  })
  user: User;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
