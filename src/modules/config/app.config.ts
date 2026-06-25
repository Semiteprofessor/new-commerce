import * as process from 'process';
import DatabaseConfig from './database.config';

export default () => ({
  environment: process.env.NODE_ENV || 'dev',
  database: {
    ...DatabaseConfig(),
  },
  integrations: {
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  },
});
