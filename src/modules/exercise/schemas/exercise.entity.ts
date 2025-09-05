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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Audio } from "../../audio/schemas";
import { ActivityType } from "../../activity-type/schemas";
import { Equipments } from "../../equipments/schemas";
import { EEffortLevel, EQuantityUnit, EMainBodyPart, EMuscleGroups, EDifficulty } from "../common/enums";
import { LowerBodyMovementType } from "../../lower-body-movement-type/schemas";
import { StretchingExercise } from "../../stretching-exercise/schemas";
import { Video } from "../../video/schemas";
import { WorkoutExercise } from "../../workout-exercise/schemas";
import { Coach } from "../../coach/schemas";

@Entity({ name: "exercise" })
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "rainy_day_exercise_id", nullable: true })
  rainyDayExerciseId: string;

  @Column({ type: "varchar", name: "no_equipment_exercise_id", nullable: true })
  noEquipmentExerciseId: string;

  @Index("preparation_guide_video_idx")
  @ManyToOne(() => Video, (video) => video.generalSafetyVideo, {
    nullable: true
  })
  @JoinColumn({
    name: "preparation_guide_video_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "exercise_preparation_guide_video"
  })
  preparationGuideVideo?: Video;

  @Index("general_safety_video_idx")
  @ManyToOne(() => Video, (video) => video.preparationGuideVideos, {
    nullable: true
  })
  @JoinColumn({
    name: "general_safety_video_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "exercise_general_safety_video"
  })
  generalSafetyVideo?: Video;

  @Index("activity_type_exercise_idx")
  @ManyToOne(() => ActivityType, (activityType) => activityType.exercises)
  @JoinColumn({
    name: "exercise_activity_type_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "exercise_activity_type"
  })
  activityType: ActivityType;

  @ManyToMany(() => Equipments, (equipments) => equipments.exercise, {
    nullable: true
  })
  @JoinTable({ name: "exercise_equipment_id" })
  equipments: Equipments[] | null;

  @Index("title_exercise_idx")
  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "aka" })
  aka: string;

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

  @Index("audio_title_exercise_idx")
  @OneToOne(() => Audio, (audio) => audio.exerciseTitle, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "title_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "exercise_title_audio"
  })
  titleAudio: Audio;

  @Column({ type: "varchar", name: "video_url", nullable: true })
  videoUrl: string;

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

  @Index("audio_manual_exercise_idx")
  @OneToOne(() => Audio, (audio) => audio.exerciseManual, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "manual_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "exercise_manual_audio"
  })
  manualAudio: Audio | null;

  @Column("text", { name: "manual_titles", array: true, default: [] })
  manualTitles: string[];

  @Column("text", { name: "manual_descriptions", array: true, default: [] })
  manualDescriptions: string[];

  // TODO! Remove after adding easier/harder exercises
  @Column({ type: "varchar", name: "easier_exercise_title", nullable: true })
  easierExerciseTitle: string;

  // TODO! Remove after adding easier/harder exercises
  @Column({ type: "varchar", name: "harder_exercise_title", nullable: true })
  harderExerciseTitle: string;

  @Column({ type: "uuid", name: "easier_exercise_id", nullable: true })
  easierExerciseId: string;

  @Column({ type: "uuid", name: "harder_exercise_id", nullable: true })
  harderExerciseId: string;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToMany(() => LowerBodyMovementType, (lowerBodyMovementType) => lowerBodyMovementType.exercise)
  lowerBodyMovementType: LowerBodyMovementType[];

  @OneToMany(() => WorkoutExercise, (workoutExercise) => workoutExercise.primaryExercise)
  primaryExercise: WorkoutExercise[];

  @OneToMany(() => WorkoutExercise, (workoutExercise) => workoutExercise.secondaryExercise)
  secondaryExercise: WorkoutExercise[];

  @OneToMany(() => StretchingExercise, (stretchingExercise) => stretchingExercise.exercise)
  stretchingExercise: StretchingExercise[];

  @ManyToOne(() => Coach, (coach) => coach.exercises, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "coach_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "exercise_coach"
  })
  coach: Coach | null;
}
