// lib/snowflake.js
import snowflake from "snowflake-sdk";

const connection = snowflake.createConnection({
  account: process.env.snowflake_account as string,
  username: process.env.snowflake_user as string,
  password: process.env.snowflake_password as string,
  warehouse: process.env.snowflake_warehouse as string,
  database: process.env.snowflake_database as string,
  schema: process.env.snowflake_schema as string,
});

export function connectToSnowflake() {
  return new Promise((resolve, reject) => {
    connection.connect((err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
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
