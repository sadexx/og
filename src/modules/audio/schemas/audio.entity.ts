import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { ActivityType } from "../../activity-type/schemas";
import { Equipments } from "../../equipments/schemas";
import { Exercise } from "../../exercise/schemas";
import { StrainClass } from "../../strain-class/schemas";
import { Stretching } from "../../stretching/schemas";

@Entity({ name: "audio" })
export class Audio {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "url" })
  url: string;

  @Column({ type: "varchar", name: "text" })
  text: string;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToOne(() => ActivityType, (activityType) => activityType.titleAudio)
  activityTypeTitle: ActivityType;

  @OneToOne(() => ActivityType, (activityType) => activityType.shortTitleAudio)
  shortTitleAudio: ActivityType;

  @OneToOne(() => ActivityType, (activityType) => activityType.abbreviationAudio)
  activityTypeAbbreviation: ActivityType;

  @OneToOne(() => Equipments, (equipments) => equipments.titleAudio)
  equipmentsTitle: Equipments;

  @OneToOne(() => Equipments, (equipments) => equipments.titleAudio)
  equipmentsSetup: Equipments;

  @OneToOne(() => Equipments, (equipments) => equipments.titleAudio)
  equipmentsAdjustment: Equipments;

  @OneToOne(() => Equipments, (equipments) => equipments.titleAudio)
  equipmentsRemoval: Equipments;

  @OneToOne(() => Stretching, (stretching) => stretching.startAudio)
  stretchingStart: Stretching;

  @OneToOne(() => Stretching, (stretching) => stretching.endAudio)
  stretchingEnd: Stretching;

  @OneToOne(() => Exercise, (exercise) => exercise.titleAudio)
  exerciseTitle: Exercise;

  @OneToOne(() => Exercise, (exercise) => exercise.manualAudio)
  exerciseManual: Exercise;

  @OneToOne(() => StrainClass, (strainClass) => strainClass.achievementAudio)
  strainClassAudio: StrainClass;
}
