import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';

dotenv.config();

export const snowflakeConnection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USER,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE,
})



snowflakeConnection.connect((err, conn) => {
  if (err) {
    console.error("❌ Unable to connect to Snowflake:", err.message);
  } else {
    console.log(`✅ Connected to Snowflake as ${conn.getId()}`);
  }
});

export default snowflakeConnection;

