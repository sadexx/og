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
import { GetByIdDto, PaginationQueryDto } from "../../common/dto";
import { globalQueryTransformer } from "../../common/helpers";
import { GroupController } from "./controllers";
import { CreateGroupDto, JoinGroupDto, RemoveMembershipFromGroupDto, UpdateGroupDto } from "./common/dto";

export class GroupRoutes {
  public path = `/${ERoutes.GROUPS}`;
  public router = Router();
  public groupController = new GroupController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareQuery(PaginationQueryDto, globalQueryTransformer),
      this.groupController.getAllGroups.bind(this.groupController)
    );
    this.router.get(
      `${this.path}/owned`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareQuery(PaginationQueryDto, globalQueryTransformer),
      this.groupController.getOwnedGroups.bind(this.groupController)
    );
    this.router.get(
      `${this.path}/joined`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareQuery(PaginationQueryDto, globalQueryTransformer),
      this.groupController.getJoinedGroups.bind(this.groupController)
    );
    this.router.get(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.groupController.getGroupById.bind(this.groupController)
    );
    this.router.get(
      `${this.path}/:id/memberships`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareQuery(PaginationQueryDto, globalQueryTransformer),
      this.groupController.getGroupMemberships.bind(this.groupController)
    );
    this.router.get(
      `${this.path}/:id/invitation-link`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.groupController.getGroupInvitationLink.bind(this.groupController)
    );
    this.router.post(
      `${this.path}`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareBody(CreateGroupDto),
      this.groupController.createGroup.bind(this.groupController)
    );
    this.router.post(
      `${this.path}/:id/join`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(JoinGroupDto),
      this.groupController.joinGroup.bind(this.groupController)
    );
    this.router.post(
      `${this.path}/:id/join-by-invitation`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.groupController.joinGroupByInvitation.bind(this.groupController)
    );
    this.router.put(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(UpdateGroupDto),
      this.groupController.updateGroup.bind(this.groupController)
    );
    this.router.delete(
      `${this.path}/:id`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.groupController.removeGroup.bind(this.groupController)
    );
    this.router.delete(
      `${this.path}/:id/leave`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      this.groupController.leaveGroup.bind(this.groupController)
    );
    this.router.delete(
      `${this.path}/:id/remove-user`,
      customPassportAuthenticate,
      roleGuard([ERole.ADMIN, ERole.USER, ERole.COACH]),
      validationMiddlewareParams(GetByIdDto),
      validationMiddlewareBody(RemoveMembershipFromGroupDto),
      this.groupController.removeUserFromGroup.bind(this.groupController)
    );
  }
}
