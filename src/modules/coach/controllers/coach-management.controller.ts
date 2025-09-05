import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { CreateCoachDto, GetAllCoachesDto, UpdateCoachDto } from "../common/dto";
import { CoachManagementService } from "../services";
import { JwtPayload } from "../../auth/common/dto";

export class CoachManagementController {
  constructor(private coachManagementService = new CoachManagementService()) {}

  public async getAllCoaches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as JwtPayload;
      const dto = plainToInstance(GetAllCoachesDto, req.query);
      const coaches = await this.coachManagementService.getAllCoaches(user, dto);
      res.status(EHttpResponseCode.OK).json(coaches);
    } catch (error) {
      next(error);
    }
  }

  public async getCoachSubscriptionsStatistics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coachesStatistics = await this.coachManagementService.getCoachSubscriptionsStatistics();
      res.status(EHttpResponseCode.OK).json(coachesStatistics);
    } catch (error) {
      next(error);
    }
  }

  public async getCoachById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const coach = await this.coachManagementService.getCoachById(id);
      res.status(EHttpResponseCode.OK).json(coach);
    } catch (error) {
      next(error);
    }
  }

  public async createCoach(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateCoachDto, req.body);
      await this.coachManagementService.createCoach(dto);
      res.status(EHttpResponseCode.CREATED).json();
    } catch (error) {
      next(error);
    }
  }

  public async updateCoach(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(UpdateCoachDto, req.body);
      await this.coachManagementService.updateCoach(id, dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }

  public async deleteCoach(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.coachManagementService.deleteCoach(id);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }
}
