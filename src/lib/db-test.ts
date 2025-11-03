import { Sequelize } from "sequelize";
import pg from "pg";
import mysql2 from "mysql2";
import sqlite3 from "sqlite3";

export async function testDatabaseConnection(dataString: string, db: string) {
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
    await sequelize.close();

    return { success: true };
  } catch (error: any) {
    console.error("Database connection test failed:", error);
    return { success: false, error: error.message };
  }
}
