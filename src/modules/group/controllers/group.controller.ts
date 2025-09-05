import { Request, Response, type NextFunction } from "express";
import { EHttpResponseCode } from "../../../common/enums";
import { plainToInstance } from "class-transformer";
import { GroupManagementService, GroupMembershipService, GroupQueryService } from "../services";
import { PaginationQueryDto } from "../../../common/dto";
import { JwtPayload } from "../../auth/common/dto";
import { CreateGroupDto, JoinGroupDto, RemoveMembershipFromGroupDto, UpdateGroupDto } from "../common/dto";

export class GroupController {
  constructor(
    private readonly groupManagementService = new GroupManagementService(),
    private readonly groupMembershipService = new GroupMembershipService(),
    private readonly groupQueryService = new GroupQueryService()
  ) {}

  public async getAllGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as JwtPayload;
      const dto = plainToInstance(PaginationQueryDto, req.query);
      const groups = await this.groupQueryService.getAllGroups(user.id, dto);
      res.status(EHttpResponseCode.OK).json(groups);
    } catch (error) {
      next(error);
    }
  }

  public async getOwnedGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as JwtPayload;
      const dto = plainToInstance(PaginationQueryDto, req.query);
      const ownedGroups = await this.groupQueryService.getOwnedGroups(user.id, dto);
      res.status(EHttpResponseCode.OK).json(ownedGroups);
    } catch (error) {
      next(error);
    }
  }

  public async getJoinedGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as JwtPayload;
      const dto = plainToInstance(PaginationQueryDto, req.query);
      const memberGroups = await this.groupQueryService.getJoinedGroups(user.id, dto);
      res.status(EHttpResponseCode.OK).json(memberGroups);
    } catch (error) {
      next(error);
    }
  }

  public async getGroupById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const group = await this.groupQueryService.getGroupById(id, user.id);
      res.status(EHttpResponseCode.OK).json(group);
    } catch (error) {
      next(error);
    }
  }

  public async getGroupMemberships(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const dto = plainToInstance(PaginationQueryDto, req.query);
      const groupMemberships = await this.groupQueryService.getGroupMemberships(id, dto);
      res.status(EHttpResponseCode.OK).json(groupMemberships);
    } catch (error) {
      next(error);
    }
  }

  public async getGroupInvitationLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const invitationLink = await this.groupQueryService.getGroupInvitationLink(id, user.id);
      res.status(EHttpResponseCode.OK).json(invitationLink);
    } catch (error) {
      next(error);
    }
  }

  public async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as JwtPayload;
      const dto = plainToInstance(CreateGroupDto, req.body);
      await this.groupManagementService.createGroup(user.id, dto);
      res.status(EHttpResponseCode.CREATED).json();
    } catch (error) {
      next(error);
    }
  }

  public async joinGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const dto = plainToInstance(JoinGroupDto, req.body);
      await this.groupManagementService.joinGroup(id, user.id, dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }

  public async joinGroupByInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      await this.groupManagementService.joinGroupByInvitation(id, user.id);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }

  public async updateGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const dto = plainToInstance(UpdateGroupDto, req.body);
      await this.groupManagementService.updateGroup(id, user.id, dto);
      res.status(EHttpResponseCode.OK).json();
    } catch (error) {
      next(error);
    }
  }

  public async removeGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      await this.groupManagementService.removeGroup(id, user.id);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }

  public async leaveGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      await this.groupMembershipService.leaveGroup(id, user.id);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }

  public async removeUserFromGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as JwtPayload;
      const dto = plainToInstance(RemoveMembershipFromGroupDto, req.body);
      await this.groupMembershipService.removeUserFromGroup(id, user.id, dto);
      res.status(EHttpResponseCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }
}
