import {NextFunction, Request, Response} from "express";
import {Permission} from "../dataModel/Permission";
import {JwtHelper} from "./JwtHelper";
import _ from "lodash";

export class PermissionAccessHelper {
  public static hasPermissions(requiredPermissions: Permission[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (requiredPermissions.length === 0) {
        next();
      } else {
        const decodedToken = JwtHelper.decodeToken(req.header('token'));
        if (decodedToken && decodedToken.role) {
          const userPermissions = decodedToken.role.permissions;
          if (userPermissions) {
            const common = _.intersection(requiredPermissions, userPermissions);
            if (common.length === requiredPermissions.length) {
              next();
            }
          }
          res.status(403).json({
            success: false,
            error: "Forbidden access"
          });
        }
      }
    }
  }
}
