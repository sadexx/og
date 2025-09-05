import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GripFirmware } from "../../grip-firmware/schemas";
import { UserGripSettings } from "../../user-additional-entities/schemas";

@Entity({ name: "grip_type" })
export class GripType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({ type: "varchar", name: "description" })
  description: string;

  @Column({ type: "varchar", name: "version" })
  version: string;

  @Column({ type: "real", name: "tare_value" })
  tareValue: number;

  @Column({ type: "boolean", name: "is_bluetooth" })
  isBluetooth: boolean;

  @Column({ type: "varchar", name: "image_url" })
  imageUrl: string;

  @Column({ type: "varchar", name: "version_background_color" })
  versionBackgroundColor: string;

  @Column({ type: "integer", name: "ordinal_number" })
  ordinalNumber: number;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToMany(() => GripFirmware, (gripFirmware) => gripFirmware.gripType)
  gripFirmwares: GripFirmware[];

  @OneToMany(() => UserGripSettings, (userGripSettings) => userGripSettings.gripType, {
    nullable: true
  })
  userGripSettings: UserGripSettings[];
}
