import { AppleLoginDto, LoginDto, MobileLoginDto, MobileRegistrationDto, RegistrationDto } from "../dto";

export type AuthRegistrationDto = RegistrationDto | MobileRegistrationDto;
export type AuthLoginDto = LoginDto | MobileLoginDto;
export type AuthDto = AuthRegistrationDto | AuthLoginDto | AppleLoginDto;
