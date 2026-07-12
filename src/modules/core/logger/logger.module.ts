import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { AppLoggerService } from './logger.service';

export const customLogLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
    verbose: 'cyan',
    silly: 'grey',
  },
};

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        const simpleConsoleFormat = winston.format.combine(
          winston.format.timestamp({ format: 'HH:mm:ss' }),
          winston.format.printf(({ level, message, timestamp, context }) => {
            const contextStr = context ? `[${context}] ` : '';
            return `${timestamp} ${contextStr}${level}: ${message}`;
          }),
        );

        const consoleFormat = winston.format.combine(
          simpleConsoleFormat,
          winston.format.colorize({
            all: true,
            colors: customLogLevels.colors,
          }),
          winston.format.printf(({ level, message, timestamp, context, ...metadata }) => {
            const contextStr = context ? `[${context}] ` : '';
            const metadataStr = Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : '';
            return `${timestamp} ${contextStr}${level}: ${message}${metadataStr}`;
          }),
          nestWinstonModuleUtilities.format.nestLike('AppName', {
            prettyPrint: true,
            colors: true,
          }),
        );

        // JSON format for file logs (for production)
        const fileFormat = winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json(),
        );

        const transports: winston.transport[] = [];

        if (isProduction) {
          transports.push(
            new DailyRotateFile({
              filename: 'logs/http-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              maxSize: '20m',
              maxFiles: '14d',
              level: 'http',
              format: fileFormat,
            }),
          );

          transports.push(
            new DailyRotateFile({
              filename: 'logs/error-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              maxSize: '20m',
              maxFiles: '30d',
              level: 'error',
              format: fileFormat,
            }),
          );

          transports.push(
            new DailyRotateFile({
              filename: 'logs/combined-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              maxSize: '20m',
              maxFiles: '14d',
              format: fileFormat,
            }),
          );
        } else {
          transports.push(
            new winston.transports.File({
              filename: 'logs/3xg.log',
              level: 'silly',
              format: consoleFormat,
            }),
          );
        }

        return {
          transports,
          levels: customLogLevels.levels,
          defaultMeta: {
            service: '3xg-api',
            environment: isProduction ? 'production' : 'development',
          },
        };
      },
    }),
  ],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
