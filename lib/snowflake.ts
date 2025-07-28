// lib/snowflake.ts
import snowflake from "snowflake-sdk";

const connection = snowflake.createConnection({
  account: process.env.snowflake_account as string,
  username: process.env.snowflake_user as string,
  password: process.env.snowflake_password as string,
  role: process.env.snowflake_role as string,
});

function runStatement(sqlText: string): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: function (err) {
        if (err) {
          reject(new Error(`Failed to run "${sqlText}": ${err.message}`));
        } else {
          resolve();
        }
      },
    });
  });
}

export async function connectToSnowflake(): Promise<typeof connection> {
  return new Promise((resolve, reject) => {
    connection.connect(async (err, conn) => {
      if (err) {
        return reject(err);
      }

      try {
        await runStatement(`USE ROLE ${process.env.snowflake_role}`);
        await runStatement(`USE WAREHOUSE ${process.env.snowflake_warehouse}`);
        await runStatement(`USE DATABASE ${process.env.snowflake_database}`);
        await runStatement(`USE SCHEMA ${process.env.snowflake_schema}`);
        resolve(conn);
      } catch (e: any) {
        reject(new Error("Connection succeeded but session initialization failed: " + e.message));
      }
    });
  });
}

export function executeQuery(sqlText: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: function (err, stmt, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      },
    });
  });
}
