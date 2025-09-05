import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkoutCategory } from "../../workout-category/schemas";
import { EDifficulty } from "../../exercise/common/enums";
import { Workout } from "../../workout/schemas";

@Entity({ name: "focal_body_part" })
export class FocalBodyPart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({
    type: "enum",
    name: "difficulty",
    enum: EDifficulty
  })
  difficulty: EDifficulty;

  @ManyToMany(() => WorkoutCategory, (workoutCategory) => workoutCategory.focalBodyParts)
  workoutCategories: WorkoutCategory[];

  @OneToMany(() => Workout, (workout) => workout.focalBodyPart)
  workouts: Workout[];
}
