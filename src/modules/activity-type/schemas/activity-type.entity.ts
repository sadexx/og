import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Audio } from "../../audio/schemas";
import { Exercise } from "../../exercise/schemas";

@Entity({ name: "activity_type" })
export class ActivityType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("activity_type_title_idx")
  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "short_title", nullable: true })
  shortTitle: string | null;

  @Column({ type: "varchar", name: "abbreviation" })
  abbreviation: string;

  @Column({ type: "boolean", name: "include_tare_value" })
  includeTareValue: boolean;

  @Column({ type: "real", name: "activity_index" })
  activityIndex: number;

  @Column({ type: "real", name: "additional_tare_value" })
  additionalTareValue: number;

  @Column({
    type: "boolean",
    name: "is_rounding_of_strain_values_enabled",
    default: false
  })
  isRoundingOfStrainValuesEnabled: boolean;

  @Index("audio_activity_type_title_idx")
  @OneToOne(() => Audio, (titleAudio) => titleAudio.activityTypeTitle, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "title_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "activity_type_title_audio"
  })
  titleAudio: Audio;

  @Index("audio_activity_type_short_title_idx")
  @OneToOne(() => Audio, (shortTitleAudio) => shortTitleAudio.shortTitleAudio, {
    nullable: true,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "short_title_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "activity_type_short_title_audio"
  })
  shortTitleAudio?: Audio | null;

  @Index("audio_activity_type_abbreviation_idx")
  @OneToOne(() => Audio, (abbreviationAudio) => abbreviationAudio.activityTypeAbbreviation, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "abbreviation_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "activity_type_abbreviation_audio"
  })
  abbreviationAudio: Audio;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToMany(() => Exercise, (exercise) => exercise.activityType)
  exercises: Exercise[];
}
