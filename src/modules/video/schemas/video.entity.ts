import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exercise } from "../../exercise/schemas";
import { EVideoType } from "../common/enums";

@Entity({ name: "video" })
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    name: "type",
    enum: EVideoType
  })
  type: EVideoType;

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "subtitle" })
  subtitle: string;

  @Column({ type: "varchar", name: "url" })
  url: string;

  @Column({ type: "integer", name: "duration", nullable: true })
  duration: number;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToMany(() => Exercise, (exercise) => exercise.preparationGuideVideo)
  preparationGuideVideos: Exercise[];

  @OneToMany(() => Exercise, (exercise) => exercise.generalSafetyVideo)
  generalSafetyVideo: Exercise[];
}
