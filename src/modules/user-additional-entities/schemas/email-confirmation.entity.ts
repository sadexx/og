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

@Entity({ name: "email_confirmation" })
export class EmailConfirmation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.emailConfirmation, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "email_confirmation_user"
  })
  user: User;

  @Column({ type: "integer", name: "code", nullable: false })
  code: number;

  @Column({
    type: "timestamp",
    name: "email_verification_date",
    nullable: false
  })
  emailVerificationExpires: Date;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
