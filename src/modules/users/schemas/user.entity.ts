import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { AccountDeleteRequest } from "../../account-deletion/schemas";
import { CustomExercise } from "../../custom-exercise/schemas";
import { FavoriteWorkout } from "../../favorite-workouts/schemas";
import { RollingPlan } from "../../rolling-plan/schemas";
import { Session } from "../../sessions/schemas";
import {
  AccountRecovery,
  EmailConfirmation,
  UserGripSettings,
  UserNotificationSettings,
  UserSettings,
  UserWallet,
  UserWorkoutSettings
} from "../../user-additional-entities/schemas";
import { EGender, ERole, EState, EWeightMeasurementSystem } from "../common/enums";
import { CustomStretching } from "../../custom-stretching/schemas";
import { UserDailyReport } from "../../users-daily-report/schemas";
import { UserGlobalStats } from "../../users-global-stats/schemas";
import { Coach } from "../../coach/schemas";
import { CoinTransaction } from "../../coin-transactions/schemas";
import { UserSubscription } from "../../user-subscriptions/schemas";
import { GroupMembership } from "../../group/schemas";
import { AppStoreProductTransaction } from "../../app-store-product/schemas";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "email", unique: true })
  email: string;

  @Column({ type: "varchar", name: "password" })
  password: string;

  @Column({ type: "enum", name: "role", enum: ERole, default: "USER" })
  role: ERole;

  @Column({ type: "varchar", name: "name", nullable: true, default: "" })
  name: string;

  @Column({ type: "enum", name: "gender", enum: EGender, nullable: true })
  gender: EGender;

  @Column({ type: "integer", name: "age", nullable: true })
  age: number;

  @Column({ type: "real", name: "weight", nullable: true })
  weight: number;

  @Column({ type: "varchar", name: "avatar_url", nullable: true })
  avatarUrl: string;

  @Column({ type: "varchar", name: "location_city", nullable: true })
  locationCity: string;

  @Column({
    type: "enum",
    name: "location_state",
    enum: EState,
    nullable: true
  })
  locationState: EState;

  @Column({
    type: "enum",
    name: "weight_measurement_system",
    enum: EWeightMeasurementSystem,
    nullable: true
  })
  weightMeasurementSystem: EWeightMeasurementSystem;

  @Column({ type: "boolean", name: "are_terms_accepted", nullable: true })
  areTermsAccepted: boolean;

  @Column({ type: "boolean", name: "is_shown_in_leader_board", nullable: true })
  isShownInLeaderBoard: boolean;

  @Column({ type: "boolean", name: "is_banned_leader_board", default: false })
  IsBannedLeaderBoard: boolean;

  @Column({ type: "boolean", name: "is_email_confirmed", default: false })
  isEmailConfirmed: boolean;

  @Column({ type: "boolean", name: "is_deactivated", default: false })
  isDeactivated: boolean;

  @Column({ type: "boolean", name: "is_survey_passed", default: false })
  isSurveyPassed: boolean;

  @Column({
    type: "timestamp",
    name: "last_password_change_date",
    nullable: true
  })
  lastPasswordChangeDate: Date;

  @Column({
    type: "timestamp",
    name: "last_account_recovery_date",
    nullable: true
  })
  lastAccountRecoveryDate: Date;

  @CreateDateColumn({ type: "timestamp", name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_date" })
  updatedDate: Date;

  @OneToOne(() => EmailConfirmation, (emailConfirmation) => emailConfirmation.user, {
    cascade: true
  })
  emailConfirmation: EmailConfirmation;

  @OneToOne(() => AccountRecovery, (accountRecovery) => accountRecovery.user, {
    cascade: true
  })
  accountRecovery: AccountRecovery;

  @OneToOne(() => AccountDeleteRequest, (accountDeleteRequest) => accountDeleteRequest.user, {
    cascade: true
  })
  accountDeleteRequest: AccountDeleteRequest;

  @OneToMany(() => FavoriteWorkout, (favoriteWorkouts) => favoriteWorkouts.user, {
    cascade: true,
    nullable: true
  })
  favoriteWorkouts: FavoriteWorkout[];

  @OneToMany(() => CustomExercise, (CustomExercise) => CustomExercise.user, {
    cascade: true,
    nullable: true
  })
  customExercises: CustomExercise[];

  @OneToMany(() => CustomStretching, (customStretching) => customStretching.user, {
    cascade: true,
    nullable: true
  })
  customStretching: CustomStretching[];

  @OneToOne(() => RollingPlan, (rollingPlan) => rollingPlan.user, {
    cascade: true
  })
  rollingPlan: RollingPlan;

  @OneToOne(() => UserSettings, (userSettings) => userSettings.user, {
    cascade: true
  })
  userSettings: UserSettings;

  @OneToOne(() => UserGripSettings, (userGripSettings) => userGripSettings.user, { cascade: true })
  userGripSettings: UserGripSettings;

  @OneToOne(() => UserNotificationSettings, (userNotificationSettings) => userNotificationSettings.user, {
    cascade: true
  })
  userNotificationSettings: UserNotificationSettings;

  @OneToOne(() => UserWorkoutSettings, (userWorkoutSettings) => userWorkoutSettings.user, {
    cascade: true
  })
  userWorkoutSettings: UserWorkoutSettings;

  @OneToMany(() => UserDailyReport, (userDailyReport) => userDailyReport.user, {
    cascade: true,
    nullable: true
  })
  dailyReportHistory: UserDailyReport[];

  @OneToOne(() => UserGlobalStats, (userGlobalStats) => userGlobalStats.user, {
    cascade: true,
    nullable: true
  })
  totalStatistics: UserGlobalStats;

  @OneToMany(() => Session, (session) => session.user, {
    cascade: true,
    nullable: true
  })
  sessions: Session[];

  @OneToOne(() => Coach, (coach) => coach.user, { nullable: true })
  coach: Coach;

  @OneToOne(() => UserWallet, (userWallet) => userWallet.user, {
    cascade: true
  })
  userWallet: UserWallet;

  @OneToMany(() => UserSubscription, (userSubscription) => userSubscription.user, {
    nullable: true
  })
  userSubscriptions: UserSubscription[];

  @OneToMany(() => CoinTransaction, (coinTransactions) => coinTransactions.user, {
    nullable: false
  })
  coinTransactions: CoinTransaction[];

  @OneToMany(() => GroupMembership, (groupMembership) => groupMembership.group)
  groupMemberships: GroupMembership[];

  @OneToMany(() => AppStoreProductTransaction, (appStoreProductTransactions) => appStoreProductTransactions.user)
  appStoreProductTransactions: AppStoreProductTransaction[];
}
