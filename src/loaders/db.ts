import { ConnectionOptions, createConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { env } from "../config/index";

const connectDB = async (): Promise<void> => {
  try {
    const connectionOption: ConnectionOptions = {
      type: "postgres",
      host: env.database.host,
      port: env.database.dbPort,
      username: env.database.username,
      password: env.database.password,
      database: env.database.name,
      synchronize: true,
      logging: true,
      entities: ["src/entities/**/*.ts"],
      namingStrategy: new SnakeNamingStrategy(),
    };

    await createConnection(connectionOption);
    console.log("PostgresSQL Connected ...");
  } catch (error) {
    throw error;
  }
};

export default connectDB;
