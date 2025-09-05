declare module "express-multipart-file-parser";
declare module "morgan";
declare namespace Express {
  export interface Request {
    locals: Record<string, any>;
  }
}
