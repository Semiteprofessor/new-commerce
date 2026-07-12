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

  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/**/*.{ts,js}'],
  logging: ['error'], //"query" | "schema" | "error" | "warn" | "info" | "log" | "migration"
  logger: 'advanced-console',
  ssl: false,
});
