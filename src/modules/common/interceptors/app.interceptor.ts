import { CallHandler, ExecutionContext, Inject, NestInterceptor } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';

function dataIsPaginated(data: any): boolean {
  return !!data.data;
}

export class AppInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: any) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
      const req: Request = context.switchToHttp().getRequest();
      const { ip, method, originalUrl, body } = req;
      const userAgent = req.get('user-agent') || '';

      const className = context.getClass().name;
      const handler = context.getHandler().name;
      const statusCode = context.switchToHttp().getResponse().statusCode;
  }
}
