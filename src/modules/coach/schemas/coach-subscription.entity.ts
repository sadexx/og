import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Coach } from "./coach.entity";
import { UserSubscription } from "../../user-subscriptions/schemas";

@Entity({ name: "coach_subscription" })
export class CoachSubscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "integer", name: "price" })
  price: number;

  @ManyToOne(() => Coach, (coach) => coach.coachSubscriptions, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "coach_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "coach_subscription_coach"
  })
  coach: Coach;

  @OneToMany(() => UserSubscription, (userSubscription) => userSubscription.coachSubscription)
  userSubscriptions: UserSubscription[];

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
