import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "just_metrics_workout_exercise_type" })
export class JustMetricsWorkoutExerciseType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "real", name: "met" })
  met: number;

  @Column({ type: "real", name: "activity_index", default: 1 })
  activityIndex: number;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @Column({ type: "real", name: "additional_tare_value", nullable: true })
  additionalTareValue: number;

  @Column({ type: "boolean", name: "include_tare_value", default: false })
  includeTareValue: boolean;

  @Column({
    type: "boolean",
    name: "is_rounding_of_strain_values_enabled",
    default: false
  })
  isRoundingOfStrainValuesEnabled: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
