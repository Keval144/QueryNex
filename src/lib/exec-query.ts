import { Sequelize } from "sequelize";
import pg from "pg";
import mysql2 from "mysql2";
import sqlite3 from "sqlite3";

export async function ExecuteQuery(
  dataString: string,
  db: string,
  Query: string,
) {
  try {
    let dialectModule: any;

    switch (db.toLowerCase()) {
      case "postgres":
      case "postgresql":
        dialectModule = pg;
        break;

      case "mysql":
      case "mariadb":
        dialectModule = mysql2;
        break;

      case "sqlite":
        dialectModule = sqlite3;
        break;

      default:
        throw new Error(`Unsupported database dialect: ${db}`);
    }

    const sequelize = new Sequelize(dataString, {
      dialectModule,
      logging: false,
      pool: { max: 1, min: 0, acquire: 10000, idle: 10000 },
    });

    await sequelize.authenticate();
    const answers = await sequelize.query(Query);
    await sequelize.close();

    return { success: true, answers };
  } catch (error: any) {
    console.error("❌ Exec-Query failed:", error);
    return { success: false, error: error.message };
  }
}
