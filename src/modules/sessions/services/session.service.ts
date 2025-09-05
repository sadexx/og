import { Request } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import { JWT_REFRESH_TOKEN_EXPIRATION_TIME } from "../../../common/configs/config";
import { NUMBER_OF_MILLISECONDS_IN_SECOND } from "../../../common/constants";
import { User } from "../../users/schemas";
import { AuthDto } from "../../auth/common/types";
import { OptionalDeviceFields } from "../common/interfaces";
import { Session } from "../schemas";
import { EPlatformType } from "../common/enums";
import { DEFAULT_DEVICE_NAME } from "../common/constants";
import { ESortOrder } from "../../../common/enums";

export class SessionService {
  private readonly sessionsRepository: Repository<Session>;

  constructor() {
    this.sessionsRepository = AppDataSource.getRepository(Session);
  }

  public async manageUserSession(user: User, dto: AuthDto, hashedRefreshToken: string, req: Request): Promise<void> {
    const SESSIONS_LIMIT = 3;

    const userSessions = await this.sessionsRepository.find({
      where: { userId: user.id },
      order: { lastActive: ESortOrder.ASC }
    });

    if (userSessions.length >= SESSIONS_LIMIT) {
      await this.sessionsRepository.remove(userSessions[0]);
    }

    await this.createSession(user, dto, hashedRefreshToken, req);
  }

  public async findCurrentSession(userId: string, deviceId: string): Promise<Session | null> {
    return await this.sessionsRepository.findOne({
      select: {
        id: true,
        deviceId: true,
        userId: true,
        refreshToken: true,
        refreshTokenExpirationDate: true
      },
      where: { user: { id: userId }, deviceId: deviceId }
    });
  }

  private async createSession(user: User, dto: AuthDto, hashedRefreshToken: string, req: Request): Promise<void> {
    const refreshTokenExpirationDate = new Date(
      Date.now() + JWT_REFRESH_TOKEN_EXPIRATION_TIME * NUMBER_OF_MILLISECONDS_IN_SECOND
    );

    const rawClientIPAddress = req.headers["x-real-ip"] || req.socket.remoteAddress;
    const clientIPAddress = Array.isArray(rawClientIPAddress) ? rawClientIPAddress[0] : rawClientIPAddress;
    const clientUserAgent = req.headers["user-agent"] || "unknown";

    const { deviceName, platform, platformVersion } = dto as OptionalDeviceFields;

    await this.sessionsRepository.save({
      userId: user.id,
      deviceId: dto.deviceId,
      deviceName: deviceName ?? DEFAULT_DEVICE_NAME,
      platform: platform ?? EPlatformType.WEB,
      platformVersion: platformVersion ?? null,
      clientIPAddress: clientIPAddress,
      clientUserAgent: clientUserAgent,
      refreshToken: hashedRefreshToken,
      refreshTokenExpirationDate: refreshTokenExpirationDate,
      lastActive: new Date(),
      user: user
    });
  }

  public async update(session: Session): Promise<Session> {
    return await this.sessionsRepository.save(session);
  }

  public async delete(session: Session): Promise<void> {
    await this.sessionsRepository.remove(session);
  }

  public async deleteAll(session: Session[]): Promise<void> {
    await this.sessionsRepository.remove(session);
  }
}
