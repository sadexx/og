import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CustomStretching } from "./custom-stretching.entity";

@Entity({ name: "custom_stretching_exercise" })
export class CustomStretchingExercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CustomStretching, (customStretching) => customStretching.customExerciseOrder, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "custom_stretching_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "custom_stretching_exercise_custom_stretching"
  })
  customStretching: CustomStretching;

  @Column({ type: "uuid", name: "custom_stretching_exercise_on_phone_id" })
  customStretchingExerciseOnPhoneId: string;

  @Column({ type: "uuid", name: "custom_exercise_id", nullable: true })
  customExerciseId: string | null;

  @Column({ type: "json", name: "custom_exercise" })
  customExercise: string;

  @Column({ type: "integer", name: "quantity" })
  quantity: number;

  @Column({ type: "integer", name: "custom_rest_duration" })
  customRestDuration: number;

  @Column({ type: "real", name: "duration" })
  duration: number;

  @Column({ type: "real", name: "ordinal_number" })
  ordinalNumber: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
