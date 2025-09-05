import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { EEffortLevel, EQuantityUnit, EMainBodyPart, EDifficulty, EMuscleGroups } from "../../exercise/common/enums";
import { User } from "../../users/schemas";

@Entity("custom_exercises")
export class CustomExercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.customExercises, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "custom_exercises_user"
  })
  user: User;

  @Column({ type: "uuid", name: "custom_exercise_on_phone_id" })
  customExerciseOnPhoneId: string;

  @Column({ type: "uuid", name: "original_exercise_id", nullable: true })
  originalExerciseId: string | null;

  @Column({ type: "varchar", name: "rainy_day_exercise_id", nullable: true })
  rainyDayExerciseId?: string;

  @Column({ type: "varchar", name: "no_equipment_exercise_id", nullable: true })
  noEquipmentExerciseId?: string;

  @Column({ type: "json", name: "preparation_guide_video_id", nullable: true })
  preparationGuideVideo?: string;

  @Column({ type: "json", name: "general_safety_video_id", nullable: true })
  generalSafetyVideo?: string;

  @Column({ type: "json", name: "activity_type" })
  activityType: string;

  @Column({ type: "json", nullable: true })
  equipments: string[] | null;

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "aka", nullable: true })
  aka: string | null;

  @Column({ type: "real", name: "met" })
  met: number;

  @Column({
    type: "enum",
    name: "effort_level",
    enum: EEffortLevel
  })
  effortLevel: EEffortLevel;

  @Column({ type: "real", name: "secs_per_quantity_unit" })
  secsPerQuantityUnit: number;

  @Column({
    type: "enum",
    name: "quantity_unit",
    enum: EQuantityUnit
  })
  quantityUnit: EQuantityUnit;

  @Column({ type: "boolean", name: "right_left_separately" })
  rightLeftSeparately: boolean;

  @Column({ type: "boolean", name: "can_contain_secondary" })
  canContainSecondary: boolean;

  @Column({ type: "boolean", name: "can_be_secondary" })
  canBeSecondary: boolean;

  @Column({
    type: "enum",
    name: "main_body_part",
    enum: EMainBodyPart
  })
  mainBodyPart: EMainBodyPart;

  @Column({ type: "varchar", name: "image_url" })
  imageUrl: string;

  @Column({ type: "json", name: "title_audio", nullable: true })
  titleAudio: string | null;

  @Column({ type: "varchar", name: "video_url", nullable: true })
  videoUrl?: string;

  @Column({
    type: "enum",
    name: "difficulty",
    enum: EDifficulty
  })
  difficulty: EDifficulty;

  @Column({
    type: "enum",
    name: "muscle_groups",
    array: true,
    enum: EMuscleGroups
  })
  muscleGroups: EMuscleGroups[];

  @Column({
    type: "boolean",
    name: "is_only_one_grip_required",
    default: false
  })
  isOnlyOneGripRequired: boolean;

  @Column({ type: "json", name: "manual_audio", nullable: true })
  manualAudio: string | null;

  @Column("text", { name: "manual_titles", array: true })
  manualTitles: string[];

  @Column("text", { name: "manual_descriptions", array: true })
  manualDescriptions: string[];

  @Column({ type: "uuid", name: "easier_exercise_id", nullable: true })
  easierExerciseId: string | null;

  @Column({ type: "uuid", name: "harder_exercise_id", nullable: true })
  harderExerciseId: string | null;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
