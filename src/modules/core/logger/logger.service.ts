import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  getLogger(context: string): ContextLogger {
    return new ContextLogger(this.logger, context);
  }
}

export class ContextLogger {
  private childLogger: Logger;

  constructor(logger: Logger, context: string) {
    this.childLogger = logger.child({ context });
  }

  log(message: string, meta: Record<string, any> = {}): void {
    this.childLogger.info(message, meta);
  }

  error(message: string, error?: Error, meta: Record<string, any> = {}): void {
    const errorMeta = {
      ...meta,
      ...(error && {
        stack: error.stack,
        message: error.message,
        name: error.name,
      }),
    };
    this.childLogger.error(message, errorMeta);
  }

  warn(message: string, meta: Record<string, any> = {}): void {
    this.childLogger.warn(message, meta);
  }

  debug(message: string, meta: Record<string, any> = {}): void {
    this.childLogger.debug(message, meta);
  }

  verbose(message: string, meta: Record<string, any> = {}): void {
    this.childLogger.verbose(message, meta);
  }

  http(message: string, meta: Record<string, any> = {}): void {
    this.childLogger.http(message, meta);
  }
}
