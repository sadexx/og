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
import { Stretching } from "../../stretching/schemas";

@Entity({ name: "stretching_exercise" })
export class StretchingExercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("stretching_exercise_idx")
  @ManyToOne(() => Exercise, (exercise) => exercise.stretchingExercise, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({
    name: "exercise_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "stretching_exercise_exercise"
  })
  exercise: Exercise;

  @Column({ type: "integer", name: "quantity" })
  quantity: number;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @ManyToMany(() => Stretching, (stretching) => stretching.exerciseOrder)
  stretching: Stretching[];
}
