import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UploadedFile } from '../../common/interfaces/uploaded-file.interface';

@Injectable()
export class FileSizeValidatorPipe implements PipeTransform {
  private readonly maxSize = 10 * 1024 * 1024; // 10MB

  private readonly allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ];

  transform(value: UploadedFile, metadata: ArgumentMetadata): UploadedFile {
    if (!value) {
      throw new BadRequestException('File must be provided.');
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        'File size exceeds the maximum size of 10MB.',
      );
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, JPG, PNG, and PDF are allowed.',
      );
    }

    return value;
  }
}
