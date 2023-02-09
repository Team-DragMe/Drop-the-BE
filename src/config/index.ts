import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export const env = {
  port: parseInt(process.env.PORT as string, 10),
  database: {
    host: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT as string, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtAlgo: process.env.JWT_ALGO as string,
  },
  googleAuthKey: process.env.API_KEY as string,
  ec2URL: process.env.EC2_URL as string,
  baseURL: process.env.BASE_URL as string,
};
