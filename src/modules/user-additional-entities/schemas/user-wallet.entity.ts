import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../users/schemas";

@Entity({ name: "user_wallet" })
export class UserWallet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "integer", name: "coin_balance", default: 0 })
  coinBalance: number;

  @OneToOne(() => User, (user) => user.userWallet, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_wallet_user"
  })
  user: User;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
