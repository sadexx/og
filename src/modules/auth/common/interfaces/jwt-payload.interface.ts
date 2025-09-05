import { JwtPayload } from "jsonwebtoken";

export interface ExtendedJwtPayload extends JwtPayload {
  id: string;
  device: string;
}
