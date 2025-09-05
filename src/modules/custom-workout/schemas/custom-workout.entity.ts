import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CustomWorkoutExercise } from "./custom-workout-exercise.entity";
import { EDifficulty } from "../../exercise/common/enums";
import { FavoriteWorkout } from "../../favorite-workouts/schemas";
import { EEnduranceLevel } from "../../workout/common/enums";

@Entity({ name: "custom_workout" })
export class CustomWorkout {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => FavoriteWorkout, (favoriteWorkout) => favoriteWorkout.customWorkout, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "favorite_workout_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "custom_workout_favorite_workout"
  })
  favoriteWorkout: FavoriteWorkout;

  @Column({ type: "uuid", name: "custom_workout_on_phone_id" })
  customWorkoutOnPhoneId: string;

  @Column({ type: "json", name: "workout_category" })
  workoutCategory: string;

  @OneToMany(() => CustomWorkoutExercise, (customWorkoutExercise) => customWorkoutExercise.customWorkout, {
    nullable: true,
    cascade: true
  })
  customExerciseOrder: CustomWorkoutExercise[];

  @Column({ type: "json", name: "focal_body_part", nullable: true })
  focalBodyPart: string | null;

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "description" })
  description: string;

  @Column({
    type: "enum",
    name: "difficulty",
    enum: EDifficulty
  })
  difficulty: EDifficulty;

  @Column({
    name: "endurance_level",
    type: "enum",
    enum: EEnduranceLevel
  })
  enduranceLevel: EEnduranceLevel;

  @Column({ type: "real", name: "duration" })
  duration: number;

  @Column({ type: "varchar", name: "image_url" })
  imageUrl: string;

  @Column({
    type: "varchar",
    name: "jogging_drills_stretching_id",
    nullable: true
  })
  joggingDrillsStretchingId: string;

  @Column({ type: "varchar", name: "warm_up_stretching_id", nullable: true })
  warmUpStretchingId: string;

  @Column({ type: "varchar", name: "cool_down_stretching_id", nullable: true })
  coolDownStretchingId: string;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
