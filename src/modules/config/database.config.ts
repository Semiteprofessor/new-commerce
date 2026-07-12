import * as dotenv from 'dotenv';

dotenv.config();
const isDevelopment = process.env.NODE_ENV === 'local';
const DatabaseConfig = () => {
  return {
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: false, // set to true only in dev mode
    entities: ['dist/modules/**/*.entity.{ts,js}'],
    migrations: ['dist/db/migrations/**/*.{ts,js}'],
    logging: ['error'], //"query" | "schema" | "error" | "warn" | "info" | "log" | "migration"
    logger: 'advanced-console',
    ...(isDevelopment ? {} : { ssl: { rejectUnauthorized: false } }),
  };
};

export default DatabaseConfig;
