import { Inject, NestInterceptor } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

function dataIsPaginated(data: any): boolean {
  return !!data.data;
}

export class AppInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_PROVIDER)) {}
}