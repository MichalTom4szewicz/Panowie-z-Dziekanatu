import { TokenContent } from "../repositories/UsersRepository";
import jwt from 'jsonwebtoken';
import {ConfigHelper} from "./ConfigHelper";

export class JwtHelper {
  public static sign(user: TokenContent): string {
    return jwt.sign(user, ConfigHelper.config.JWT_SECRET, {
      expiresIn: ConfigHelper.config.JWT_EXPIRES_IN
    });
  }
}
