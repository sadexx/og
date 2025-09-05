import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { FavoriteWorkout } from "../../favorite-workouts/schemas";

@Entity("custom_workout_settings")
export class CustomWorkoutSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => FavoriteWorkout, (favoriteWorkout) => favoriteWorkout.customWorkoutSettings, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "favorite_workout_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "custom_workout_settings_favorite_workout"
  })
  favoriteWorkout: FavoriteWorkout;

  @Column({ type: "uuid", name: "custom_workout_settings_on_phone_id" })
  customWorkoutSettingsOnPhoneId: string;

  @Column({ type: "boolean", name: "is_warm_up_stretching_enabled" })
  isWarmUpStretchingEnabled: boolean;

  @Column({ type: "boolean", name: "is_jogging_drills_stretching_enabled" })
  isJoggingDrillsStretchingEnabled: boolean;

  @Column({ type: "boolean", name: "is_cool_down_stretching_enabled" })
  isCoolDownStretchingEnabled: boolean;

  @Column({ type: "boolean", name: "is_no_equipment_enabled" })
  isNoEquipmentEnabled: boolean;

  @Column({ type: "boolean", name: "is_rainy_day_enabled" })
  isRainyDayEnabled: boolean;

  @Column({ type: "boolean", name: "is_countdown_timer_enabled" })
  isCountdownTimerEnabled: boolean;

  @Column({ type: "boolean", name: "is_wild_card_enabled" })
  isWildCardEnabled: boolean;

  @Column({ type: "boolean", name: "is_circuit_break_enabled" })
  isCircuitBreakEnabled: boolean;

  @Column({ type: "int", name: "circuit_break_duration" })
  circuitBreakDuration: number;

  @Column({ type: "json", name: "lower_body_movement_type" })
  lowerBodyMovementType: string;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
