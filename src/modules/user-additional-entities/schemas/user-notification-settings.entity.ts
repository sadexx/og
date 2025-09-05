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

@Entity({ name: "user_notification_settings" })
export class UserNotificationSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.userNotificationSettings, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_notification_settings_user"
  })
  user: User;

  @Column({
    type: "boolean",
    name: "is_workout_reminder_enabled",
    default: true
  })
  isWorkoutReminderEnabled: boolean;

  @Column({
    type: "integer",
    name: "target_workouts_per_week",
    default: 1
  })
  targetWorkoutsPerWeek: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
