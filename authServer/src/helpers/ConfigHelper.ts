import {config} from "dotenv";

export interface ConfigBody {
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  AUTH_API_PORT: number;
  KEY_PATH: string;
  CRT_PATH: string;
}

export class ConfigHelper {
  private static _instance: ConfigHelper;
  private static _config;

  private constructor() {
    const configContents = config({
      encoding: 'utf-8'
    });
    if (configContents.error) {
      throw new Error("Cannot find environmental variables");
    } else {
      ConfigHelper._config = ConfigHelper.convertToKnownValues(configContents.parsed);
    }
  }

  public static init(): void {
    if (!ConfigHelper._instance) {
      ConfigHelper._instance = new ConfigHelper();
    }
  }

  public static get config(): ConfigBody {
    return ConfigHelper._config;
  }

  private static convertToKnownValues(parsed: {[key: string]: string}): ConfigBody {
    return {
      JWT_SECRET: parsed['JWT_SECRET'] ? parsed['JWT_SECRET'] : '',
      JWT_EXPIRES_IN: parsed['JWT_EXPIRES_IN'] ? parsed['JWT_EXPIRES_IN'] : '',
      AUTH_API_PORT: parsed['AUTH_API_PORT'] ? +parsed['AUTH_API_PORT'] : 0,
      KEY_PATH: parsed['KEY_PATH'] ? parsed['KEY_PATH'] : '',
      CRT_PATH: parsed['CRT_PATH'] ? parsed['CRT_PATH'] : ''
    };
  }
}
