import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeormConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    url: process.env.URL_DB,
    entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
    migrationsTableName: 'migration',
    migrations: [__dirname + '/migration/*.ts'],
    cli: {
      migrationsDir: __dirname + '/migration',
    },
    synchronize: false,
    migrationsRun: true,
    ssl: process.env.IS_PRODUCTION == 'true',
  };
};
