import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { EDifficulty } from "../../exercise/common/enums";
import { FavoriteWorkout } from "../../favorite-workouts/schemas";
import { FocalBodyPart } from "../../focal-body-parts/schemas";
import { EEnduranceLevel, EWorkoutStatus } from "../common/enums";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { WorkoutCategory } from "../../workout-category/schemas";
import { Coach } from "../../coach/schemas";

@Entity({ name: "workout" })
export class Workout {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("workout_category_idx")
  @ManyToOne(() => WorkoutCategory, (workoutCategory) => workoutCategory.workout)
  @JoinColumn({
    name: "workout_category_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "workout_workout_category"
  })
  workoutCategory: WorkoutCategory;

  @ManyToMany(() => WorkoutExercise, (workoutExercise) => workoutExercise.workout, {
    nullable: true
  })
  @JoinTable({ name: "workout_exercise_order_id" })
  exerciseOrder: WorkoutExercise[];

  @Index("workout_focal_body_part_idx")
  @ManyToOne(() => FocalBodyPart, (focalBodyPart) => focalBodyPart.workouts, {
    nullable: true
  })
  @JoinColumn({
    name: "focal_body_part_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "workout_focal_body_part"
  })
  focalBodyPart: FocalBodyPart;

  @ManyToOne(() => Coach, (coach) => coach.workouts, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "coach_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "workout_coach"
  })
  coach: Coach;

  @Index("workout_title_idx")
  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "description", nullable: true })
  description: string;

  @Column({
    type: "enum",
    name: "difficulty",
    enum: EDifficulty
  })
  difficulty: EDifficulty;

  @Column({
    type: "enum",
    name: "endurance_level",
    enum: EEnduranceLevel
  })
  enduranceLevel: EEnduranceLevel;

  @Column({ type: "real", name: "duration", default: 0 })
  duration: number;

  @Column({ type: "varchar", name: "image_url" })
  imageUrl: string;

  @Index("workout_jogging_drills_stretching_idx")
  @Column({
    type: "varchar",
    name: "jogging_drills_stretching_id",
    nullable: true
  })
  joggingDrillsStretchingId: string;

  @Index("workout_warm_up_stretching_idx")
  @Column({ type: "varchar", name: "warm_up_stretching_id", nullable: true })
  warmUpStretchingId: string;

  @Index("workout_cool_down_stretching_idx")
  @Column({ type: "varchar", name: "cool_down_stretching_id", nullable: true })
  coolDownStretchingId: string;

  @Column({
    type: "enum",
    name: "status",
    enum: EWorkoutStatus,
    default: EWorkoutStatus.VERIFIED
  })
  status: EWorkoutStatus;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToMany(() => FavoriteWorkout, (favoriteWorkouts) => favoriteWorkouts.workout)
  favoriteWorkouts: FavoriteWorkout[];
}
