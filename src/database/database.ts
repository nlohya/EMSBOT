import { createConnection, type Connection } from "mysql";
import dotenv from "dotenv";
import { useLogger } from "../utils/logger";
import { exit } from "process";

dotenv.config();

export class Database {
  private static __instance: Database | null = null;

  private _connection: Connection | undefined;

  constructor() {
    try {
      this._connection = createConnection({
        host: process.env["MSQL_HOST"],
        port: parseInt(process.env["MSQL_PORT"]!),
        user: process.env["MSQL_USER"],
        password: process.env["MSQL_PASS"],
        database: process.env["MSQL_DB"],
      });

      this._connection.connect();
    } catch (err) {
      useLogger().error(
        `Error happened while connecting to the database : ${
          (err as Error).message
        }`
      );
      exit();
    }
  }

  static instance(): Database {
    if (this.__instance == null) {
      this.__instance = new Database();
    }

    return this.__instance!;
  }

  connection() {
    return this._connection;
  }
}
