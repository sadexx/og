import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Exercise } from "../../exercise/schemas";
import { Workout } from "../../workout/schemas";
import { ECircuit } from "../common/enums";
import { Coach } from "../../coach/schemas";

@Entity({ name: "workout_exercise" })
export class WorkoutExercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("primary_exercise_idx")
  @ManyToOne(() => Exercise, (exercise) => exercise.primaryExercise, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({
    name: "primary_exercise_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "workout_exercise_primary_exercise"
  })
  primaryExercise: Exercise | null;

  @Index("secondary_exercise_idx")
  @ManyToOne(() => Exercise, (exercise) => exercise.secondaryExercise, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({
    name: "secondary_exercise_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "workout_exercise_secondary_exercise"
  })
  secondaryExercise: Exercise | null;

  @Column({ type: "integer", name: "quantity" })
  quantity: number;

  @Column({ type: "integer", name: "sets" })
  sets: number;

  @Column({
    type: "enum",
    name: "circuit",
    enum: ECircuit
  })
  circuit: ECircuit;

  @Column({ type: "real", name: "duration" })
  duration: number;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @ManyToOne(() => Coach, (coach) => coach.workoutExercises, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "coach_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "workout_coach"
  })
  coach: Coach;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @ManyToMany(() => Workout, (workout) => workout.exerciseOrder)
  workout: Workout[];
}
