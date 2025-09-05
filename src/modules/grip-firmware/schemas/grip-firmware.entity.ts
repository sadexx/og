import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { GripType } from "../../grip-types/schemas";

@Entity("grip_firmware")
export class GripFirmware {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "version" })
  version: string;

  @Column({ type: "varchar", name: "version_name" })
  versionName: string;

  @Column({ type: "varchar", name: "image_url" })
  fileUrl: string;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @Index("grip_type_grip_firmware_idx")
  @ManyToOne(() => GripType, (gripType) => gripType.gripFirmwares)
  @JoinColumn({
    name: "grip_firmware_grip_type_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "grip_firmware_grip_type"
  })
  gripType: GripType;
}
