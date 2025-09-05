import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { FocalBodyPart } from "../../focal-body-parts/schemas";
import { LowerBodyMovementType } from "../../lower-body-movement-type/schemas";
import { Workout } from "../../workout/schemas";
import { EFeatureKey } from "../common/enums";

@Entity({ name: "workout_category" })
export class WorkoutCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => FocalBodyPart, (focalBodyPart) => focalBodyPart.workoutCategories, {
    nullable: true
  })
  @JoinTable({
    name: "focal_body_part_workout_category_id",
    joinColumn: { name: "workout_category_id" },
    inverseJoinColumn: { name: "focal_body_part_id" }
  })
  focalBodyParts: FocalBodyPart[];

  @ManyToOne(() => LowerBodyMovementType, (lowerBodyMovementType) => lowerBodyMovementType.workoutCategories, {
    nullable: true
  })
  @JoinTable({
    name: "default_lower_body_movement_type_id"
  })
  defaultLowerBodyMovementType: LowerBodyMovementType | null;

  @Column({ name: "is_focal_body_part_filter_enabled", default: false })
  isFocalBodyPartFilterEnabled: boolean;

  @Index("workout_category_title_idx")
  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "abbreviation" })
  abbreviation: string;

  @Column({ type: "varchar", name: "description" })
  description: string;

  @Column({ type: "integer", name: "duration_range_smaller_number" })
  durationRangeSmallerNumber: number;

  @Column({ type: "integer", name: "duration_range_greater_number" })
  durationRangeGreaterNumber: number;

  @Column({ type: "boolean", name: "is_lower_body_movement_type_enabled" })
  isLowerBodyMovementTypeEnabled: boolean;

  @Column({
    type: "enum",
    name: "feature_key",
    enum: EFeatureKey
  })
  featureKey: EFeatureKey;

  @Column({ type: "varchar", name: "image_url" })
  imageUrl: string;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToMany(() => Workout, (workout) => workout.workoutCategory)
  workout: Workout[];
}
