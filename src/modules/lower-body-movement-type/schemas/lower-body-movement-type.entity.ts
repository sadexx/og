import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { WorkoutCategory } from "../../workout-category/schemas";
import { Exercise } from "../../exercise/schemas";

@Entity({ name: "lower_body_movement_type" })
export class LowerBodyMovementType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("lower_body_movement_type_title_idx")
  @Column({ type: "varchar", name: "title" })
  title: string;

  @Index("lower_body_movement_type_exercise_idx")
  @ManyToOne(() => Exercise, (exercise) => exercise.lowerBodyMovementType, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({
    name: "exercise_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "lower_body_movement_type_exercise"
  })
  exercise: Exercise;

  @Column({ type: "real", name: "met" })
  met: number;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToMany(() => WorkoutCategory, (workoutCategory) => workoutCategory.defaultLowerBodyMovementType)
  workoutCategories: WorkoutCategory[];
}
