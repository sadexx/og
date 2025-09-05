import { Router } from "express";
import { ERoutes } from "../../common/enums";
import {
  customPassportAuthenticate,
  validationMiddlewareBody,
  validationMiddlewareParams,
  validationMiddlewareQuery
} from "../../common/middleware";
import { roleGuard } from "../../common/guards";
import { ERole } from "../users/common/enums";
import { GetByIdDto } from "../../common/dto";
import { globalQueryTransformer } from "../../common/helpers";
import { WorkoutExerciseIdsDto } from "../workout/common/dto";
import { CoachWorkoutExercisesController, CoachWorkoutsController } from "./controllers";
import {
  GetVerifiedCoachWorkoutsDto,
  GetUnverifiedCoachWorkoutsDto,
  CreateCoachWorkoutDto,
  UpdateCoachWorkoutDto,
  CoachWorkoutManualDecisionDto,
  GetCoachExercisesByWorkoutDto,
  CreateCoachWorkoutExerciseDto,
  UpdateCoachWorkoutExerciseDto
} from "./common/dto";

export class CoachWorkoutRoutes {
  public path = `/${ERoutes.COACHES}`;
  public router = Router();
  public coachWorkoutsController = new CoachWorkoutsController();
  public coachWorkoutExercisesController = new CoachWorkoutExercisesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /*
     * Coach Workouts
     */

    this.router.get(
      `${this.path}/workouts/verified`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareQuery(GetVerifiedCoachWorkoutsDto, globalQueryTransformer),
      this.coachWorkoutsController.getVerifiedCoachWorkouts.bind(this.coachWorkoutsController)
    );
    this.router.get(
      `${this.path}/workouts/unverified`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.COACH]),
      validationMiddlewareQuery(GetUnverifiedCoachWorkoutsDto, globalQueryTransformer),
      this.coachWorkoutsController.getUnverifiedCoachWorkouts.bind(this.coachWorkoutsController)
    );
    this.router.get(
      `${this.path}/workouts/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.coachWorkoutsController.getCoachWorkoutById.bind(this.coachWorkoutsController)
    );
    this.router.post(
      `${this.path}/workouts`,
      customPassportAuthenticate,
      roleGuard([ERole.COACH]),
      validationMiddlewareBody(CreateCoachWorkoutDto),
      this.coachWorkoutsController.createCoachWorkout.bind(this.coachWorkoutsController)
    );
    this.router.put(
      `${this.path}/workouts/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateCoachWorkoutDto),
      this.coachWorkoutsController.updateCoachWorkout.bind(this.coachWorkoutsController)
    );
    this.router.put(
      `${this.path}/workouts/manual-decision/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(CoachWorkoutManualDecisionDto),
      this.coachWorkoutsController.coachWorkoutManualDecision.bind(this.coachWorkoutsController)
    );
    this.router.put(
      `${this.path}/workouts/:id/workout-exercises/order`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(WorkoutExerciseIdsDto),
      this.coachWorkoutsController.updateCoachWorkoutExercisesOrder.bind(this.coachWorkoutsController)
    );
    this.router.delete(
      `${this.path}/workouts/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.coachWorkoutsController.deleteCoachWorkout.bind(this.coachWorkoutsController)
    );

    /*
     * Coach Workout Exercises
     */

    this.router.get(
      `${this.path}/workout-exercises/by-workout`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareQuery(GetCoachExercisesByWorkoutDto, globalQueryTransformer),
      this.coachWorkoutExercisesController.getCoachExercisesByWorkout.bind(this.coachWorkoutExercisesController)
    );
    this.router.get(
      `${this.path}/workout-exercises/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.coachWorkoutExercisesController.getCoachWorkoutExerciseById.bind(this.coachWorkoutExercisesController)
    );
    this.router.post(
      `${this.path}/workout-exercises`,
      customPassportAuthenticate,
      roleGuard([ERole.COACH]),
      validationMiddlewareBody(CreateCoachWorkoutExerciseDto),
      this.coachWorkoutExercisesController.createCoachWorkoutExercise.bind(this.coachWorkoutExercisesController)
    );
    this.router.put(
      `${this.path}/workout-exercises/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateCoachWorkoutExerciseDto),
      this.coachWorkoutExercisesController.updateCoachWorkoutExercise.bind(this.coachWorkoutExercisesController)
    );

    this.router.delete(
      `${this.path}/workout-exercises/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.coachWorkoutExercisesController.deleteCoachWorkoutExercise.bind(this.coachWorkoutExercisesController)
    );
  }
}
