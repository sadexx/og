import { PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, Entity, JoinColumn } from "typeorm";
import { User } from "../../users/schemas";

@Entity({ name: "account_delete_request" })
export class AccountDeleteRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.accountDeleteRequest, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "account_delete_request_user"
  })
  user: User;

  @Column({
    type: "timestamp",
    name: "request_deletion_expires",
    nullable: false
  })
  requestDeletionExpires: Date;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;
}
