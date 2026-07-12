import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
// import { CloudinaryService } from './cloudinary.service';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class AssetsService {
  constructor(
    private readonly s3Service: S3Service,
    // private readonly cloudinaryService: CloudinaryService,
  ) {}

  async saveFile(file: UploadedFile): Promise<string> {
    return await this.s3Service.upload(
      file.buffer,
      file.originalname,
      undefined,
      file.mimetype,
    );
  }
  catch(s3Error) {
    console.error('S3 Upload Error:', s3Error); // or use a logging service
    throw new Error('Failed to upload the asset. Please try again later.');

    // Fallback to Cloudinary if S3 fails
    // try {
    //   // return await this.s3Service.upload(buffer, originalName);
    // } catch (cloudinaryError) {
    //   console.error('Cloudinary Upload Error:', cloudinaryError);
    //   throw new Error('Failed to upload the asset. Please try again later.');
    // }
  }
}
