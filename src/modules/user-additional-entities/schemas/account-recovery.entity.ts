import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { User } from "../../users/schemas";

@Entity({ name: "account_recovery" })
export class AccountRecovery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.accountRecovery, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "account_recovery_user"
  })
  user: User;

  @Column({ type: "integer", name: "code", nullable: false })
  code: number;

  @Column({
    type: "timestamp",
    name: "email_code_expires",
    nullable: false
  })
  emailCodeExpires: Date;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;
}
