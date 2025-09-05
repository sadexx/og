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
import { User } from "../../users/schemas";
import { CoachSubscription } from "./coach-subscription.entity";
import { Workout } from "../../workout/schemas";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { Exercise } from "../../exercise/schemas";

@Entity({ name: "coach" })
export class Coach {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "description", nullable: false })
  description: string;

  @Column({ type: "varchar", name: "cover_image_url", nullable: true })
  coverImageUrl: string;

  @OneToOne(() => User, (user) => user.coach, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "coach_user"
  })
  user: User;

  @OneToMany(() => CoachSubscription, (coachSubscriptions) => coachSubscriptions.coach, {
    nullable: false
  })
  coachSubscriptions: CoachSubscription[];

  @OneToMany(() => Workout, (workouts) => workouts.coach)
  workouts: Workout[];

  @OneToMany(() => WorkoutExercise, (workoutExercises) => workoutExercises.coach)
  workoutExercises: WorkoutExercise[];

  @OneToMany(() => Exercise, (exercises) => exercises.coach)
  exercises: Exercise[];

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
