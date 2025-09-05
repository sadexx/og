import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Column
} from "typeorm";
import { CustomWorkout } from "../../custom-workout/schemas";
import { CustomWorkoutSettings } from "../../custom-workout-settings/schemas";
import { User } from "../../users/schemas";
import { Workout } from "../../workout/schemas";

@Entity({ name: "favorite_workout" })
export class FavoriteWorkout {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "custom_favorite_workout_on_phone_id" })
  customFavoriteWorkoutOnPhoneId: string;

  @ManyToOne(() => User, (user) => user.favoriteWorkouts, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "favorite_workout_user"
  })
  user: User;

  @ManyToOne(() => Workout, (workout) => workout.favoriteWorkouts, {
    nullable: true
  })
  @JoinColumn({
    name: "workout_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "favorite_workout_workout"
  })
  workout: Workout | null;

  @OneToOne(() => CustomWorkout, (CustomWorkout) => CustomWorkout.favoriteWorkout, {
    nullable: true,
    cascade: true
  })
  customWorkout: CustomWorkout | null;

  @OneToOne(() => CustomWorkoutSettings, (customWorkoutSettings) => customWorkoutSettings.favoriteWorkout, {
    nullable: true,
    cascade: true
  })
  customWorkoutSettings: CustomWorkoutSettings | null;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
