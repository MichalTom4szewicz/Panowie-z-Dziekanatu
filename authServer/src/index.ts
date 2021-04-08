import express from 'express';
import { UsersController } from "./controllers/UsersController";
import { AuthenticationController } from "./controllers/AuthenticationController";
import {ConfigHelper} from "./helpers/ConfigHelper";
import {AuthServerBuilder, morganLogger} from "./helpers/AuthServerBuilder";

ConfigHelper.init();

const app = express();
app.use(express.json());

const controllers = [UsersController, AuthenticationController]

const authServer = new AuthServerBuilder()
  .setCertPath(ConfigHelper.config.CRT_PATH)
  .setKeyPath(ConfigHelper.config.KEY_PATH)
  .setControllers(controllers)
  .setMorganLogger(morganLogger)
  .setPort(ConfigHelper.config.AUTH_API_PORT)
  .setRequestListener(true)
  .setJsonParser(true)
  .build();

authServer.start();
