import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { map, Observable } from 'rxjs';

function dataIsPaginated(data: any): boolean {
  return !!data.data;
}

export class AppInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const { ip, method, originalUrl, body } = req;
    const userAgent = req.get('user-agent') || '';

    const className = context.getClass().name;
    const handler = context.getHandler().name;
    const statusCode = context.switchToHttp().getResponse().statusCode;

    this.logger.info(`Requesting🟢🟢🟢`, {
      method,
      url: originalUrl,
      className,
      handler,
      body: JSON.stringify(body),
    });

    console.log(ip, userAgent);

    return next.handle().pipe(
      map((_data) => {
        const data = _data || {};
        // Todo - type response
        const response: any = {
          data,
          status:
            statusCode >= 200 && statusCode <= 299 ? 'success' : 'failure',
          message: data.message
            ? data.message
            : statusCode >= 200 && statusCode <= 299
              ? 'success'
              : 'failure',
          code: context.switchToHttp().getResponse().statusCode,
        };

        if (dataIsPaginated(data) && data.pageInfo) {
          response.data = data.data;
          response.pageInfo = {
            total: data.pageInfo.total,
            page: data.pageInfo?.page || data.page,
            limit: data.pageInfo.limit || data.limit,
            totalPages: data.pageInfo.totalPages || data.totalCount,
          };
        }

        return response;
      }),
    );
  }
}
