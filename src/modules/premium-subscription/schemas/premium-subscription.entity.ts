import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, Column, OneToMany } from "typeorm";
import { EPremiumSubscriptionDuration } from "../common/enums";
import { UserSubscription } from "../../user-subscriptions/schemas";

@Entity({ name: "premium_subscription" })
export class PremiumSubscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "integer", name: "price" })
  price: number;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive: boolean;

  @Column({
    type: "enum",
    name: "duration",
    enum: EPremiumSubscriptionDuration
  })
  duration: EPremiumSubscriptionDuration;

  @OneToMany(() => UserSubscription, (userSubscription) => userSubscription.premiumSubscription)
  userSubscriptions: UserSubscription[];

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
