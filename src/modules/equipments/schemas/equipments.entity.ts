import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Audio } from "../../audio/schemas";
import { Exercise } from "../../exercise/schemas";

@Entity({ name: "equipments" })
export class Equipments {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("title_equipments_idx")
  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "key_title" })
  keyTitle: string;

  @Column({ type: "real", name: "setup_duration" })
  setupDuration: number;

  @Column({ type: "real", name: "removal_duration" })
  removalDuration: number;

  @Column({ type: "real", name: "adjustment_duration" })
  adjustmentDuration: number;

  @Column({ type: "integer", name: "priority", default: 0 })
  priority: number;

  @Column({ type: "varchar", name: "setup_video_url", nullable: true })
  setupVideoUrl: string;

  @Column({ type: "varchar", name: "adjustment_video_url", nullable: true })
  adjustmentVideoUrl: string;

  @Column({ type: "varchar", name: "removal_video_url", nullable: true })
  removalVideoUrl: string;

  @Column({ type: "varchar", name: "setup_audio_text", nullable: true })
  setupAudioText: string;

  @Column({ type: "varchar", name: "adjustment_audio_text", nullable: true })
  adjustmentAudioText: string;

  @Column({ type: "varchar", name: "removal_audio_text", nullable: true })
  removalAudioText: string;

  @Index("audio_equipments_idx")
  @OneToOne(() => Audio, (audio) => audio.equipmentsTitle, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "title_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "equipments_title_audio"
  })
  titleAudio: Audio;

  @Index("audio_equipments_setup_idx")
  @OneToOne(() => Audio, (audio) => audio.equipmentsSetup, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "setup_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "equipments_setup_audio"
  })
  setupAudio: Audio;

  @Index("audio_equipments_adjustment_idx")
  @OneToOne(() => Audio, (audio) => audio.equipmentsAdjustment, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "adjustment_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "equipments_adjustment_audio"
  })
  adjustmentAudio: Audio;

  @Index("audio_equipments_removal_idx")
  @OneToOne(() => Audio, (audio) => audio.equipmentsRemoval, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "removal_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "equipments_removal_audio"
  })
  removalAudio: Audio;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @ManyToMany(() => Exercise, (exercise) => exercise.equipments)
  exercise: Exercise[];
}
