import * as dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

export default () => ({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,

  synchronize: false,
  autoLoadEntities: false,

  entities: isDevelopment ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'],

  migrations: isDevelopment
    ? ['src/db/migrations/**/*.ts']
    : ['dist/db/migrations/**/*.js'],

  logging: ['error'],
  logger: 'advanced-console',

  ssl: isDevelopment
    ? false
    : {
        rejectUnauthorized: false,
      },
});
