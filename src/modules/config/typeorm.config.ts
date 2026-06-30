import * as dotenv from 'dotenv';

import DatabaseConfig from './database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config();
export default new DataSource(DatabaseConfig() as DataSourceOptions);
