import { Request } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/configs/db.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  BCRYPT_SALT_ROUNDS,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET
} from "../../../common/configs/config";
import { validateOrReject } from "class-validator";
import { ForbiddenException, UnauthorizedException } from "../../../common/exceptions";
import { JwtPayload } from "../common/dto";
import { NUMBER_OF_MILLISECONDS_IN_SECOND } from "../../../common/constants";
import { AuthTokenOutput } from "../common/outputs";
import { SessionService } from "../../sessions/services";
import { User } from "../../users/schemas";
import { UserService } from "../../users/services";
import { AuthDto, AuthLoginDto, AuthRegistrationDto } from "../common/types";

export class AuthService {
  private readonly usersRepository: Repository<User>;

  constructor(
    private readonly sessionService = new SessionService(),
    private readonly userService = new UserService()
  ) {
    this.usersRepository = AppDataSource.getRepository(User);
  }

  public async register(dto: AuthRegistrationDto): Promise<User> {
    const { email, password } = dto;

    const existingUser = await this.usersRepository.findOne({
      select: { email: true },
      where: { email }
    });

    if (existingUser) {
      throw new ForbiddenException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      areTermsAccepted: true
    });
    await this.usersRepository.save(user);
    await this.userService.createUserSettings(user.id);

    return user;
  }

  public async login(dto: AuthLoginDto): Promise<User> {
    const { email, password } = dto;
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isDeactivated: true,
        role: true
      },
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException("Incorrect email or password.");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException("Incorrect email or password.");
    }

    return user;
  }

  public async processUserSession(user: User, dto: AuthDto, req: Request): Promise<AuthTokenOutput> {
    const { accessToken, refreshToken } = await this.generateTokens(user, dto.deviceId);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, BCRYPT_SALT_ROUNDS);

    await this.sessionService.manageUserSession(user, dto, hashedRefreshToken, req);

    return { accessToken, refreshToken };
  }

  public async generateTokens(user: User, deviceId: string): Promise<AuthTokenOutput> {
    const accessToken = jwt.sign({ id: user.id, role: user.role, device: deviceId }, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME
    });
    const refreshToken = jwt.sign({ id: user.id, role: user.role, device: deviceId }, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME
    });

    return { accessToken, refreshToken };
  }

  public async refreshTokens(clientRefreshToken: string): Promise<AuthTokenOutput> {
    const decoded: JwtPayload = jwt.decode(clientRefreshToken) as JwtPayload;
    const dto = Object.assign(new JwtPayload(), decoded);
    await validateOrReject(dto);
    const session = await this.sessionService.findCurrentSession(dto.id, dto.device);

    if (!session) {
      throw new ForbiddenException("Invalid token.");
    }

    if (session.refreshTokenExpirationDate < new Date()) {
      throw new ForbiddenException("Invalid token.");
    }

    const isRefreshTokenMatching = await bcrypt.compare(clientRefreshToken, session.refreshToken);

    if (!isRefreshTokenMatching) {
      throw new ForbiddenException("Invalid token.");
    }

    const user = await this.usersRepository.findOne({
      where: { id: session.userId }
    });

    if (!user) {
      throw new ForbiddenException("Invalid token.");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user, session.deviceId);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, BCRYPT_SALT_ROUNDS);

    const refreshTokenExpirationDate = new Date(
      Date.now() + JWT_REFRESH_TOKEN_EXPIRATION_TIME * NUMBER_OF_MILLISECONDS_IN_SECOND
    );

    session.lastActive = new Date();
    session.refreshToken = hashedRefreshToken;
    session.refreshTokenExpirationDate = refreshTokenExpirationDate;
    await this.sessionService.update(session);

    return { accessToken, refreshToken };
  }

  public async logout(clientRefreshToken: string): Promise<void> {
    const decoded: JwtPayload = jwt.decode(clientRefreshToken) as JwtPayload;
    const dto = Object.assign(new JwtPayload(), decoded);
    await validateOrReject(dto);
    const session = await this.sessionService.findCurrentSession(dto.id, dto.device);

    if (!session) {
      throw new ForbiddenException("Invalid token.");
    }

    await this.sessionService.delete(session);
  }
}
