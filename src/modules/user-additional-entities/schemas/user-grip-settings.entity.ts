import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToOne
} from "typeorm";
import { GripType } from "../../grip-types/schemas";
import { User } from "../../users/schemas";

@Entity("user_grip_settings")
export class UserGripSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.userGripSettings, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_grip_settings_user"
  })
  user: User;

  @ManyToOne(() => GripType, (gripType) => gripType.userGripSettings, {
    nullable: true
  })
  @JoinColumn({
    name: "grip_type_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "user_grip_settings_grip_type"
  })
  gripType: GripType | null;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;
}
