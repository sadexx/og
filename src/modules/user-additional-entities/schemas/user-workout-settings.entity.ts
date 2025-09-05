import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ECompleteWorkoutWithPauseAfter } from "../../settings/common/enums";
import { User } from "../../users/schemas";

@Entity({ name: "user_workout_settings" })
export class UserWorkoutSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.userWorkoutSettings, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_workout_settings_user"
  })
  user: User;

  @Column({
    type: "real",
    name: "rest_duration_for_low_endurance_level_workout"
  })
  restDurationForLowEffortLevelExercise: number;

  @Column({
    type: "real",
    name: "rest_duration_for_medium_endurance_level_workout"
  })
  restDurationForMediumEffortLevelExercise: number;

  @Column({
    type: "real",
    name: "rest_duration_for_high_endurance_level_workout"
  })
  restDurationForHighEffortLevelExercise: number;

  @Column({ type: "real", name: "rest_duration_for_vigorous_endurance_level" })
  restDurationForVigorousEffortLevelExercise: number;

  @Column({
    type: "enum",
    name: "complete_workout_with_pause_after",
    enum: ECompleteWorkoutWithPauseAfter
  })
  completeWorkoutWithPauseAfter: ECompleteWorkoutWithPauseAfter;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
