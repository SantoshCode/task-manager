import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import * as config from 'config';

// const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
