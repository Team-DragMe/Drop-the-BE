import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export const env = {
  port: parseInt(process.env.PORT as string, 10) as number,
  database: {
    host: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT as string, 10) as number,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};
