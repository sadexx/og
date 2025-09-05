import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Audio } from "../../audio/schemas";
import { StretchingExercise } from "../../stretching-exercise/schemas";

@Entity({ name: "stretching" })
export class Stretching {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => StretchingExercise, (stretchingExercise) => stretchingExercise.stretching, {
    nullable: true
  })
  @JoinTable({ name: "stretching_exercise_order_id" })
  exerciseOrder: StretchingExercise[];

  @Index("stretching_title_idx")
  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @Column({ type: "varchar", name: "start_text" })
  startText: string;

  @Column({ type: "varchar", name: "end_text" })
  endText: string;

  @Index("stretching_audio_start_idx")
  @OneToOne(() => Audio, (audio) => audio.stretchingStart, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "audio_start_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "stretching_start_audio"
  })
  startAudio: Audio;

  @Index("stretching_audio_end_idx")
  @OneToOne(() => Audio, (audio) => audio.stretchingEnd, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "audio_end_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "stretching_end_audio"
  })
  endAudio: Audio;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
