import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CoachSubscription } from "../../coach/schemas";
import { User } from "../../users/schemas";
import { PremiumSubscription } from "../../premium-subscription/schemas";

@Entity({ name: "user_subscription" })
export class UserSubscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamp", name: "end_date", nullable: false })
  endDate: Date;

  @Column({ type: "timestamp", name: "last_renewed_at" })
  lastRenewedAt: Date;

  @Column({ type: "boolean", name: "is_auto_renewable", default: true })
  isAutoRenewable: boolean;

  @ManyToOne(() => User, (user) => user.userSubscriptions, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_subscription_user"
  })
  user: User;

  @ManyToOne(() => CoachSubscription, (coachSubscription) => coachSubscription.userSubscriptions, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "coach_subscription_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_subscription_coach_subscription_FK"
  })
  coachSubscription: CoachSubscription | null;

  @ManyToOne(() => PremiumSubscription, (premiumSubscription) => premiumSubscription.userSubscriptions, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "premium_subscription_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_subscription_premium_subscription_FK"
  })
  premiumSubscription: PremiumSubscription | null;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
