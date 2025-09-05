import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Audio } from "../../audio/schemas";

@Entity("strain_class")
export class StrainClass {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("audio_achievement_strain_class_idx")
  @OneToOne(() => Audio, (audio) => audio.strainClassAudio, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "achievement_audio_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "strain_class_achievement_audio"
  })
  achievementAudio: Audio;

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "achievement_audio_text", nullable: true })
  achievementAudioText: string;

  @Column({ type: "varchar", name: "image_url", nullable: true })
  imageUrl: string | null;

  @Column({ type: "bigint", name: "lower_bound" })
  lowerBound: bigint;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
