import { ConnectionOptions, createConnection, useContainer } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { env } from './config';
import Container from 'typedi';
import { DailyNote } from './entities/DailyNote';
import { Plan } from './entities/Plan';
import { PlanOrder } from './entities/PlanOrder';
import { User } from './entities/User';

const connectDB = async (): Promise<void> => {
  try {
    const connectionOption: ConnectionOptions = {
      type: 'postgres',
      host: env.database.host,
      port: env.database.dbPort,
      username: env.database.username,
      password: env.database.password,
      database: env.database.name,
      synchronize: env.database.synchronize,
      logging: env.database.logging,
      entities: [
        __dirname + '/entities/*{.ts, .js}',
        DailyNote,
        Plan,
        PlanOrder,
        User,
      ],
      namingStrategy: new SnakeNamingStrategy(),
    };
    useContainer(Container);

    await createConnection(connectionOption);
    console.log('PostgresSQL Connected ...');
  } catch (error) {
    throw error;
  }
};

export default connectDB;
