import {compare} from 'bcrypt';
import {Request, Response, Router} from "express";
import {UsersRepository} from "../repositories/UsersRepository";
import {JwtHelper} from "../helpers/JwtHelper";
import {SqliteConnection} from "../database/SqliteConnection";
import {BaseController} from "./BaseController";
import {isBefore} from 'date-fns';

export class AuthenticationController extends BaseController {
  constructor(private usersRepository: UsersRepository) {
    super();
  }

  public async authenticate(request: Request, response: Response): Promise<Response> {
    try {
      const { username, password } = request.body;
      if (username && password) {
        const user = await this.usersRepository.getUserById(username);
        if (user) {
          const isPasswordOk = await compare(password, user.password);
          if (isPasswordOk) {
            const token = JwtHelper.sign(user);
            return response.status(200).json({
              success: true,
              token
            });
          }
        }
      }
      return response.status(200).json({
        success: false,
        result: "Incorrect username or password"
      });
    } catch (e) {
      return response.status(200).json({
        success: false,
        result: "Incorrect username or password"
      });
    }
  }

  public async verifyToken(request: Request, response: Response): Promise<Response> {
    const token = request.header('token');
    try {
      const decodedToken = JwtHelper.decodeToken(token);
      if (decodedToken && decodedToken.exp && isBefore(Date.now(), decodedToken.exp)) {
        return response.status(200).json({
          success: true,
          token: decodedToken
        });
      }
    }
    catch (e) {
      return response.status(200).json({
        success: false,
        token: null
      })
    }
    return response.status(200).json({
      success: false,
      token: null
    });
  }

  public static addRouterPaths(router: Router): void {
    router.post('/authenticate', async (req: Request, res: Response) => {
      return new AuthenticationController(new UsersRepository(await SqliteConnection.getConnection())).authenticate(req, res);
    });

    router.get('/verify', async (req: Request, res: Response) => {
      return new AuthenticationController(new UsersRepository(await SqliteConnection.getConnection())).verifyToken(req, res);
    });
  }
}
