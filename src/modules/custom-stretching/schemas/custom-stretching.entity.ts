import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../users/schemas";
import { CustomStretchingExercise } from "./custom-stretching-exercise.entity";

@Entity({ name: "custom_stretching" })
export class CustomStretching {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "custom_stretching_on_phone_id" })
  customStretchingOnPhoneId: string;

  @ManyToOne(() => User, (user) => user.favoriteWorkouts, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "custom_stretching_user"
  })
  user: User;

  @OneToMany(() => CustomStretchingExercise, (customStretchingExercise) => customStretchingExercise.customStretching, {
    nullable: true,
    cascade: true
  })
  customExerciseOrder: CustomStretchingExercise[];

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "real", name: "ordinal_number" })
  ordinalNumber: number;

  @Column({ type: "varchar", name: "start_text" })
  startText: string;

  @Column({ type: "varchar", name: "end_text" })
  endText: string;

  @Column({ type: "json", name: "start_audio" })
  startAudio: string;

  @Column({ type: "json", name: "end_audio" })
  endAudio: string;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
