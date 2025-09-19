import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne
} from "typeorm";
import { SubscriptionPlan } from "./subscription-plan.entity";
import { User } from "../../users/schemas";

@Entity({ name: "subscription_plan_assignment" })
export class SubscriptionPlanAssignment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamp", name: "end_date", nullable: false })
  endDate: Date;

  @ManyToOne(() => SubscriptionPlan, (subscriptionPlan) => subscriptionPlan.subscriptionPlanAssignments)
  @JoinColumn({
    name: "subscription_plan_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "subscription_plan_assignment_subscription_plan_FK"
  })
  subscriptionPlan: SubscriptionPlan;

  @OneToOne(() => User, (user) => user.subscriptionPlanAssignment, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "subscription_plan_assignment_user_FK"
  })
  user: User;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
