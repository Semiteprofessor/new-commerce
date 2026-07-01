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

  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/db/migrations/**/*.js'],

  ssl: {
    rejectUnauthorized: false,
  },
});
