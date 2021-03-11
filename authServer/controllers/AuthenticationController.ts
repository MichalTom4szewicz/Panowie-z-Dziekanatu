import jwt from 'jsonwebtoken';
import {Request, Response} from "express";

export class AuthenticationController {

  public authenticate(request: Request, response: Response): void {
    const { username, password } = request.body;

  }
}
