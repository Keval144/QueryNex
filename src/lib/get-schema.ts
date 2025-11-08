import { Sequelize } from "sequelize";
import pg from "pg";
import mysql2 from "mysql2";
import sqlite3 from "sqlite3";

export async function getSchema(dataString: string, db: string) {
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

    let tables: string[] = [];

    if (db === "sqlite") {
      const [rows]: any = await sequelize.query(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
      );
      tables = rows.map((r: any) => r.name);
    } else {
      const [rows]: any = await sequelize.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        ORDER BY table_name;
      `);
      tables = rows.map((r: any) => r.table_name);
    }

    const schema: Record<string, any[]> = {};

    for (const table of tables) {
      let columnQuery = "";

      if (db === "sqlite") {
        columnQuery = `PRAGMA table_info(${table});`;
      } else {
        columnQuery = `
          SELECT
              column_name,
              data_type,
              character_maximum_length,
              is_nullable,
              column_default
          FROM information_schema.columns
          WHERE table_name = '${table}'
          ORDER BY ordinal_position;
        `;
      }

      const [columns]: any = await sequelize.query(columnQuery);
      schema[table] = columns;
    }

    await sequelize.close();

    const formattedSchema = Object.entries(schema)
      .map(([table, cols]) => {
        const colsText = cols
          .map(
            (c: any) =>
              `- ${c.column_name} (${c.data_type}${
                c.character_maximum_length
                  ? `(${c.character_maximum_length})`
                  : ""
              }) ${c.is_nullable === "NO" ? "NOT NULL" : ""} ${
                c.column_default ? `DEFAULT ${c.column_default}` : ""
              }`,
          )
          .join("\n");
        return `TABLE ${table}:\n${colsText}`;
      })
      .join("\n\n");

    return { success: true, schema: formattedSchema };
  } catch (error: any) {
    console.error("❌ getSchema() failed:", error);
    return { success: false, error: error.message };
  }
}
