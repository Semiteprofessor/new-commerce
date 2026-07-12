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

<<<<<<< HEAD
  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/**/*.{ts,js}'],
  logging: ['error'], //"query" | "schema" | "error" | "warn" | "info" | "log" | "migration"
  logger: 'advanced-console',
  ssl: false,
=======
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/db/migrations/**/*.js'],

  ssl: {
    rejectUnauthorized: false,
  },
>>>>>>> cbb35b8b55f480354592d7ff588611c60bd980a2
});
