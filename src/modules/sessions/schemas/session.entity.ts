import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EPlatformType } from "../common/enums";
import { User } from "../../users/schemas";

@Entity({ name: "session" })
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "user_id", nullable: false })
  userId: string;

  @Column({ type: "varchar", name: "device_id", nullable: false })
  deviceId: string;

  @Column({ type: "varchar", name: "device_name", nullable: false })
  deviceName: string;

  @Column({ type: "enum", enum: EPlatformType, nullable: true })
  platform: EPlatformType;

  @Column({ type: "varchar", name: "platform_version", nullable: true })
  platformVersion: string | null;

  @Column({ type: "varchar", name: "client_ip_address", nullable: false })
  clientIPAddress: string;

  @Column({ type: "varchar", name: "client_user_agent", nullable: false })
  clientUserAgent: string;

  @Column({ type: "varchar", name: "refresh_token", nullable: false })
  refreshToken: string;

  @Column({
    type: "timestamp",
    name: "refresh_token_expiration_date",
    nullable: false
  })
  refreshTokenExpirationDate: Date;

  @Column({ type: "timestamp", name: "last_active", nullable: false })
  lastActive: Date;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_date",
    nullable: false
  })
  createdDate: Date;

  @Index("user_id_idx")
  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
    foreignKeyConstraintName: "session_user"
  })
  user: User;
}
