import {TokenContent, UsersRepository} from "../repositories/UsersRepository";
import {Request, Response, Router} from "express";
import {EncryptionHelper} from "../helpers/EncryptionHelper";
import {SqliteConnection} from "../database/SqliteConnection";
import {BaseController} from "./BaseController";
import {User} from "../database/entities/User";
import {RoleRepository} from '../repositories/RoleRepository';
import {Role} from '../dataModel/Role';
import {UserRole} from '../database/entities/UserRole';

export class UsersController extends BaseController {
  constructor(private usersRepository: UsersRepository, private _roleRepository: RoleRepository) {
    super();
  }

  public async addUser(request: Request, response: Response): Promise<Response> {
    const user: TokenContent = request.body.user;
    if (user) {
      user.password = await EncryptionHelper.encryptPassword(user.password);
      await this.usersRepository.addUser(user);
      return response.status(200).json({
        success: true
      });
    }
    return response.status(200).json({
      success: false
    });
  }

  public async getUsers(request: Request, response: Response): Promise<Response> {
    try {
      const users = await this.usersRepository.getUsers()
      const result = users.map((user: User) => {
        return {
          username: user.username,
          userRole: user.userRole
        };
      });
      return response.status(200).json({
        success: true,
        result
      });
    } catch (e) {
      return response.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
  }

  public async getUserById(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.params.id as string;
      console.log(userId);
      if (userId) {
        const user = await this.usersRepository.getUserById(userId);
        const result = {
          username: user.username,
          role: user.role
        };
        return response.status(200).json({
          success: true,
          result
        });
      } else {
        return response.status(200).json({
          success: false,
          result: null,
          error: "incomplete request"
        })
      }
    } catch (e) {
      console.log(e);
      return response.status(200).json({
        success: false,
        result: null
      });
    }
  }

  public async updateUserRole(req: Request, res: Response): Promise<Response> {
    try {
      const username: string = req.body.username;
      const roleName: string = req.body.role;
      const role: UserRole = await this._roleRepository.getRoleByName(roleName);
      if (username && role) {
        const result = await this.usersRepository.updateUserRole(username, role);
        return res.status(200).json({
          success: result
        });
      } else {
        return res.status(400);
      }
    } catch (e) {
      console.error(e.message);
      return res.status(500);
    }
  }

  public static addRouterPaths(router: Router): void {
    router.post('/user', async (req: Request, res: Response) => {
      return new UsersController(
        new UsersRepository(await SqliteConnection.getConnection()),
        new RoleRepository(await SqliteConnection.getConnection())
      ).addUser(req, res);
    });
    router.get('/user/:id', async (req: Request, res: Response) => {
      return new UsersController(
        new UsersRepository(await SqliteConnection.getConnection()),
        new RoleRepository(await SqliteConnection.getConnection())
      ).getUserById(req, res);
    });
    router.get('/users', async (req: Request, res: Response) => {
      return new UsersController(
        new UsersRepository(await SqliteConnection.getConnection()),
        new RoleRepository(await SqliteConnection.getConnection())
      ).getUsers(req, res);
    });
    router.put('/role/update', async (req: Request, res: Response) => {
      return new UsersController(
        new UsersRepository(await SqliteConnection.getConnection()),
        new RoleRepository(await SqliteConnection.getConnection())
      ).updateUserRole(req, res);
    });
  }
}
