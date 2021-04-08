import {Connection, createConnection} from "typeorm";

export class SqliteConnection {
  private static _connection: Connection;

  public static async init(): Promise<void> {
    if (!SqliteConnection._connection) {
      await SqliteConnection.connect();
    }
  }

  private static async connect(): Promise<void> {
    SqliteConnection._connection = await createConnection();
  }

  public static async getConnection(): Promise<Connection> {
    await SqliteConnection.init();
    return SqliteConnection._connection;
  }
}
