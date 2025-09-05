import { User } from "../../schemas";

export interface UserWithPasswordStatus extends Omit<User, "password"> {
  isPasswordSet: boolean;
}
