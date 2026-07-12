import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseInPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    const val = parseInt(value);
    if (isNaN(val)) {
      throw new BadRequestException(`${value} is not a number/integer`);
    }
    return value;
  }
}
