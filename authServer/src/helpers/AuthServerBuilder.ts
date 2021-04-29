import express, {Express, Handler, Request, Response, Router} from "express";
import {BaseController} from "../controllers/BaseController";
import morgan, {FormatFn, TokenIndexer} from "morgan";
import {createServer} from "https";
import {readFileSync} from "fs";
import {AuthServer} from "../AuthServerBuilder";
import {IncomingMessage, ServerResponse} from "http";
import cors, { CorsOptions } from 'cors';

function colorOutput(statusCode: string) {
  if (statusCode) {
    const statusGroup = +statusCode[0];
    switch (statusGroup) {
      case 2:
        return `\x1b[32m${statusCode}\x1b[0m`;
      case 4:
        return `\x1b[33m${statusCode}\x1b[0m`;
      case 5:
        return `\x1b[31m${statusCode}\x1b[0m`;
      default:
        return statusCode;
    }
  }
}

export const morganLogger: FormatFn = (tokens: TokenIndexer, req: IncomingMessage, res: ServerResponse) => {
  return [
    `[${new Date().toISOString()}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    colorOutput(tokens.status(req, res)),
    '; Response time:',
    tokens['response-time'](req, res),
    'ms'
  ].join(' ');
};

export class AuthServerBuilder {
  private _port: number;
  private _controllers = [];
  private _keyPath: string;
  private _certPath: string;
  private _loggerFn: Handler;
  private _requestListenerFlag = false;
  private _jsonParser = false;

  public setPort(port: number): AuthServerBuilder {
    if (port) {
      this._port = port;
      return this;
    } else {
      throw new Error('Cannot find PORT in env variables!');
    }
  }

  public setKeyPath(keyPath: string): AuthServerBuilder {
    if (keyPath) {
      this._keyPath = keyPath;
    }
    return this;
  }

  public setCertPath(certPath: string): AuthServerBuilder {
    if (certPath) {
      this._certPath = certPath;
    }
    return this;
  }

  public setControllers(controllers: Partial<BaseController>[]): AuthServerBuilder {
    if (controllers) {
      this._controllers = controllers;
    }
    return this;
  }

  public setMorganLogger(loggerFn: FormatFn): AuthServerBuilder {
    this._loggerFn = morgan(loggerFn);
    return this;
  }

  public setRequestListener(flag: boolean): AuthServerBuilder {
    this._requestListenerFlag = flag;
    return this;
  }

  public setJsonParser(flag: boolean): AuthServerBuilder {
    this._jsonParser = flag;
    return this;
  }

  public build(): AuthServer {
    const app = this.prepareApp();
    this.prepareRouterForApp(app);
    const server = this.prepareServerFromApp(app);

    const authServer = new AuthServer();
    authServer.port = this._port;
    authServer.server = server;
    return authServer;
  }

  private prepareServerFromApp(app: Express) {
    const server = createServer({
      key: readFileSync(this._keyPath),
      cert: readFileSync(this._certPath)
    });
    if (this._requestListenerFlag) {
      server.on('request', app)
    }
    return server;
  }

  private prepareRouterForApp(app: Express) {
    const router = Router();
    const options: CorsOptions = {
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Cache-Control',
      ],
      credentials: false,
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
      origin: '*',
      optionsSuccessStatus: 200,
      preflightContinue: true,
    };
    router.use(cors(options));
    router.options('*', cors(options), (req: Request, res: Response) => {
      res.send('OK');
    });
    this._controllers.forEach((controller) => {
      controller.addRouterPaths(router);
    })
    app.use(router);
  }

  private prepareApp() {
    const app = express();
    if (this._jsonParser) {
      app.use(express.json())
    }
    if (this._loggerFn) {
      app.use(this._loggerFn);
    }
    return app;
  }
}
